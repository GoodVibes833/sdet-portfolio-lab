/**
 * whatodo Service Worker
 * Provides offline caching for core assets and API responses
 */

const CACHE_NAME = 'whatodo-v3';
const STATIC_ASSETS = [
  '/',
  '/explore',
  '/map',
  '/wishlist',
  '/visited',
  '/profile',
  '/manifest.json',
  '/globals.css',
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: Cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (Supabase, Google Maps, etc.)
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // Cache strategy for static assets
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Return cached version and fetch update in background
          fetch(request).then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response.clone());
              });
            }
          }).catch(() => {});
          return cached;
        }

        // Not in cache, fetch and cache
        return fetch(request).then((response) => {
          if (!response.ok) return response;
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      }).catch(() => {
        // Fallback for offline
        return new Response('Offline - 캐시된 데이터를 사용할 수 없습니다', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
    );
  }

  // Network-first strategy for API/data
  if (url.pathname.includes('/api/') || request.headers.get('Accept')?.includes('application/json')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        });
      })
    );
  }
});

function isStaticAsset(url) {
  // Do NOT cache Next.js build chunks - they have hashed filenames
  if (url.includes('/_next/')) return false;
  const staticExtensions = ['.css', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.woff2', '.json'];
  return staticExtensions.some((ext) => url.endsWith(ext)) || url === '/' || url.endsWith('/');
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-wishlist') {
    event.waitUntil(syncWishlistData());
  }
});

async function syncWishlistData() {
  // Background sync logic for offline wishlist updates
  console.log('[SW] Syncing wishlist data...');
}

// Handle push notifications
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data?.json() || {};
  } catch {
    data = { title: '오늘 뭐하지?', body: event.data?.text() || '새로운 알림이 있어요!' };
  }
  const title = data.title || '오늘 뭐하지?';
  const options = {
    body: data.body || '새로운 장소를 확인해보세요!',
    icon: '/globe.svg',
    badge: '/globe.svg',
    tag: data.tag || 'default',
    requireInteraction: false,
    data: { url: data.url || data.data || '/', ...data },
    actions: data.actions || [],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || event.notification.data || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
