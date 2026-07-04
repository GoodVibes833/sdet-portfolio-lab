import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MapView from "@/components/MapView";
import type { Place } from "@/data/places";

// ── Mock Leaflet (browser-only) ──────────────────────────────
const mockMapInstance = {
  setView: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  removeLayer: vi.fn(),
  addLayer: vi.fn(),
  remove: vi.fn(),
  invalidateSize: vi.fn(),
  flyTo: vi.fn(),
  getZoom: vi.fn(() => 13),
  getCenter: vi.fn(() => ({ lat: 43.6532, lng: -79.3832 })),
  getBounds: vi.fn(() => ({
    contains: () => true,
    getNorthEast: () => ({ lat: 44, lng: -78 }),
    getSouthWest: () => ({ lat: 43, lng: -80 }),
  })),
};

const mockMarkerInstance = {
  addTo: vi.fn(() => mockMarkerInstance),
  on: vi.fn(() => mockMarkerInstance),
  off: vi.fn(() => mockMarkerInstance),
  remove: vi.fn(),
  setLatLng: vi.fn(() => mockMarkerInstance),
  bindPopup: vi.fn(() => mockMarkerInstance),
  bindTooltip: vi.fn(() => mockMarkerInstance),
  openPopup: vi.fn(),
  closePopup: vi.fn(),
};

const mockCircleInstance = {
  addTo: vi.fn(() => mockCircleInstance),
  remove: vi.fn(),
};

const mockPolylineInstance = {
  addTo: vi.fn(() => mockPolylineInstance),
  remove: vi.fn(),
};

const mockLayerGroupInstance = {
  addTo: vi.fn(() => mockLayerGroupInstance),
  addLayer: vi.fn(),
  clearLayers: vi.fn(),
  remove: vi.fn(),
};

vi.mock("leaflet", () => ({
  default: {
    map: vi.fn(() => mockMapInstance),
    marker: vi.fn(() => mockMarkerInstance),
    circle: vi.fn(() => mockCircleInstance),
    polyline: vi.fn(() => mockPolylineInstance),
    layerGroup: vi.fn(() => mockLayerGroupInstance),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    divIcon: vi.fn(() => ({})),
    latLng: vi.fn((lat, lng) => ({ lat, lng })),
    latLngBounds: vi.fn(() => ({
      extend: vi.fn(),
    })),
    MarkerClusterGroup: vi.fn(() => mockLayerGroupInstance),
  },
}));

vi.mock("leaflet.markercluster", () => ({
  MarkerClusterGroup: vi.fn(() => mockLayerGroupInstance),
}));

// ── Mock Next.js ─────────────────────────────────────────────
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// ── Mock Contexts ────────────────────────────────────────────
const mockPlaces: Place[] = [
  {
    id: "place-1",
    name: "테스트 카페",
    nameEn: "Test Cafe",
    city: "toronto",
    category: "카페",
    neighborhood: "켄싱턴",
    shortDesc: "아는 사람만 아는 카페",
    description: "조용한 카페",
    tags: ["조용한"],
    tips: ["평일이 좋아요"],
    image: "https://via.placeholder.com/400",
    lat: 43.6534,
    lng: -79.4009,
    rating: 4.7,
    priceLevel: 1,
    address: "123 Test St",
    indoorOutdoor: "indoor",
    featured: false,
    isFree: false,
    recommendScore: 4,
    lastUpdated: "2024-01-01",
  },
  {
    id: "place-2",
    name: "테스트 식당",
    nameEn: "Test Restaurant",
    city: "toronto",
    category: "맛집",
    neighborhood: "다운타운",
    shortDesc: "맛있는 식당",
    description: "현지인 추천",
    tags: ["맛집"],
    tips: ["저녁 예약 필요"],
    image: "https://via.placeholder.com/400",
    lat: 43.6540,
    lng: -79.3850,
    rating: 4.5,
    priceLevel: 2,
    address: "456 Food Ave",
    indoorOutdoor: "indoor",
    featured: true,
    isFree: false,
    recommendScore: 5,
    lastUpdated: "2024-01-01",
  },
];

vi.mock("@/context/PlacesContext", () => ({
  usePlaces: () => ({
    places: mockPlaces,
    cityPlaces: mockPlaces,
    loading: false,
    error: null,
    selectedCity: null,
    setSelectedCity: vi.fn(),
    refreshCity: vi.fn(),
  }),
}));

vi.mock("@/context/GeolocationContext", () => ({
  useGeoContext: () => ({
    lat: null,
    lng: null,
    error: null,
    loading: false,
    permissionStatus: "prompt" as const,
    requestLocation: vi.fn(),
  }),
}));

// ── Mock Hooks ───────────────────────────────────────────────
vi.mock("@/hooks/useUserData", () => ({
  useUserData: () => ({
    hasVisited: () => false,
    checkIn: vi.fn(),
    uncheckIn: vi.fn(),
  }),
}));

vi.mock("@/hooks/useUserStore", () => ({
  useUserStore: () => ({
    wishlist: [],
    toggleWishlist: vi.fn(),
    visited: [],
    toggleVisited: vi.fn(),
    hydrated: true,
  }),
}));

// ── Mock Child Components ────────────────────────────────────
vi.mock("@/components/SearchBox", () => ({
  default: () => <div data-testid="search-box">SearchBox</div>,
}));

vi.mock("@/components/LoadingSkeleton", () => ({
  default: () => <div data-testid="loading-skeleton">Loading...</div>,
}));

vi.mock("@/components/SettingsPanel", () => ({
  default: () => <div data-testid="settings-panel">Settings</div>,
}));

vi.mock("@/components/GuidePanel", () => ({
  default: () => <div data-testid="guide-panel">Guide</div>,
}));

vi.mock("@/components/ShareButton", () => ({
  default: () => <button>Share</button>,
}));

vi.mock("@/components/ExportButtons", () => ({
  default: () => <button>Export</button>,
}));

vi.mock("@/components/FavoritesButton", () => ({
  default: () => <button>♥</button>,
}));

vi.mock("@/components/VisitButton", () => ({
  default: () => <button>Visit</button>,
}));

// ── Mock utils ───────────────────────────────────────────────
vi.mock("@/lib/utils", () => ({
  getPlaceImage: () => "https://via.placeholder.com/400",
  cn: (...args: (string | false | undefined)[]) => args.filter(Boolean).join(" "),
}));

vi.mock("@/lib/openHours", () => ({
  isOpenNow: () => true,
}));

// ── window mocks ─────────────────────────────────────────────
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false, // desktop by default
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, "localStorage", {
  writable: true,
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
});

// ── Tests ────────────────────────────────────────────────────
describe("MapView — listPanel / detailPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("렌더링 시 listPanel 이 정의되어 ReferenceError 가 발생하지 않는다", () => {
    // If listPanel were undefined, this render would throw ReferenceError
    expect(() => render(<MapView />)).not.toThrow();
  });

  it("장소 목록(listPanel)이 렌더링된다", async () => {
    const { container } = render(<MapView />);
    // Wait for useEffect to populate visibleBounds and filtered list
    await vi.waitFor(() => {
      expect(container.textContent).toContain("테스트 식당");
    }, { timeout: 1000 });
    // At least one place from mock data renders in listPanel
    expect(container.textContent).toMatch(/테스트 (카페|식당)/);
  });

  it("정렬 UI(거리/평점/리뷰)가 표시된다", () => {
    const { container } = render(<MapView />);
    expect(container.textContent).toMatch(/거리|평점|리뷰/);
  });

  it("장소 수 카운트가 표시된다", async () => {
    const { container } = render(<MapView />);
    await vi.waitFor(() => {
      expect(container.textContent).toMatch(/\d+개 장소/);
    }, { timeout: 1000 });
  });
});
