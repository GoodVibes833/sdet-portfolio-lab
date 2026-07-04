# 배포 & 운영 가이드

## 배포 환경

| 항목 | 설정 |
|------|------|
| **플랫폼** | Vercel |
| **URL** | https://whatodo-seven.vercel.app |
| **프레임워크** | Next.js 16 |
| **빌드 출력** | Static + SSR |
| **CDN** | Vercel Edge Network |

## 배포 명령어

```bash
# 로컬 빌드 검증
npm run build

# Vercel CLI 배포 (프로덕션)
npx vercel --prod

# Vercel CLI 배포 (프리뷰)
npx vercel
```

## 빌드 설정

```typescript
// next.config.ts
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  staticPageGenerationTimeout: 120,
  images: {
    unoptimized: true,  // static export 대응
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};
```

## PWA 설정

```json
// public/manifest.json
{
  "name": "오늘 뭐하지? — 캐나다 워홀 핫플",
  "short_name": "오늘뭐하지",
  "display": "standalone",
  "background_color": "#1e3a5f",
  "theme_color": "#1e3a5f",
  "icons": [{ "src": "/globe.svg", "sizes": "any" }],
  "shortcuts": [
    { "name": "지도 보기", "url": "/map" },
    { "name": "장소 검색", "url": "/search" }
  ]
}
```

## 모니터링

| 도구 | 용도 |
|------|------|
| **Vercel Analytics** | 웹 바이탈스 (LCP, FID, CLS) |
| **Vercel Speed Insights** | 성능 모니터링 |
| **Google Analytics 4** | 사용자 행동 추적 |

## 비용 예상

| 항목 | 현재 | 예상 성장 시 |
|------|------|------------|
| **Vercel** | Free Tier | Pro ($20/월) |
| **도메인** | CA$15/년 | — |
| **Supabase** | — | Free → Pro ($25/월) |
| **합계** | CA$15/년 | CA$45/월 |

## 보안

- **XSS**: React 기본 escaping + DOMPurify (향후)
- **CSRF**: SameSite 쿠키 (백엔드 연동 시)
- **Privacy**: 모든 개인 데이터는 클라이언트 localStorage에만 저장

---
*버전 1.0 | 2026-05-14*
