# 시스템 아키텍처

## 기술 스택

| 계층 | 기술 | 선택 이유 |
|------|------|----------|
| **프레임워크** | Next.js 16 + React 19 | SSR/SSG, 파일 기반 라우팅, Vercel 최적화 |
| **언어** | TypeScript | 타입 안전성, 유지보수성 |
| **스타일** | Tailwind CSS 4 | 유틸리티 퍼스트, 다크모드 지원 |
| **지도** | Leaflet.js + OpenStreetMap | 무료, 경량, 커스텀 마커 가능 |
| **아이콘** | Lucide React | 일관된 디자인, tree-shaking |
| **QR 코드** | qrcode.react | 네이티브 지원 |
| **상태 관리** | React Hooks + localStorage | 서버 없이 클라이언트 상태 유지 |
| **데이터** | 정적 JSON (src/data/) | Zero-cost, 빌드타임 임포트 |
| **배포** | Vercel | CDN, 엣지 함수, 자동 HTTPS |

## 아키텍처 다이어그램

```
User Browser
    │
    ├─▶ Vercel Edge CDN (정적 파일)
    │
    ├─▶ Next.js App Router
    │       ├─ Static Generation (SSG): /place/[id]
    │       ├─ Client Side: /map (Leaflet)
    │       └─ API Routes: /api/* (SSR/Edge)
    │
    └─▶ localStorage (Client State)
            ├─ favorites, visited
            ├─ reviews, tags, memos
            ├─ collections, filterPresets
            └─ gamification (points, badges)

Data Layer
    └─▶ Static JSON Modules
            ├─ toronto.ts, vancouver.ts, ...
            └─ places.ts (aggregate)
```

## 디렉토리 구조

```
app/
├── page.tsx              # 메인 MapView
├── layout.tsx            # 루트 레이아웃 (ThemeProvider)
├── globals.css           # Tailwind + 커스텀 테마
├── map/page.tsx          # 지도 전용 뷰
├── place/[id]/page.tsx   # 장소 상세 (SSG)
└── ...

components/
├── MapView.tsx           # 핵심 지도 + 사이드바
├── SearchBox.tsx         # 검색 + 자동완성
├── FilterBar.tsx         # 카테고리/반경 필터
├── ShareButton.tsx       # QR/템플릿/소셜 공유
├── ReviewForm.tsx        # 리뷰 작성
├── MemoInput.tsx         # 메모 입력
├── TagInput.tsx          # 태그 관리
├── CollectionManager.tsx # 컬렉션 CRUD
├── BadgePanel.tsx        # 배지/레벨 UI
├── RouletteWheel.tsx     # 포인트 룰렛
├── OnboardingTour.tsx    # 신규 유저 가이드
├── SettingsPanel.tsx     # 폰트/고대비 설정
├── ExportButtons.tsx     # CSV/프린트
├── WorldClock.tsx        # 세계 시계
└── GuidePanel.tsx        # 도움말

hooks/
├── useGamification.ts    # 포인트/배지/레벨 로직
└── useToast.ts           # 알림 토스트

data/
├── places.ts             # 타입 + 통합 export
├── toronto.ts            # 토론토 장소 데이터
├── vancouver.ts          # 밴쿠버 장소 데이터
└── ... (8개 도시)

public/
├── manifest.json         # PWA 매니페스트
└── icons/                # PWA 아이콘
```

## 상태 관리 설계

### localStorage 기반 클라이언트 상태

| 키 | 데이터 | 설명 |
|----|--------|------|
| `favorites` | `string[]` | 찜한 장소 ID |
| `visited` | `{id,ts}[]` | 방문한 장소 + 타임스탬프 |
| `reviews` | `{[id]: string}` | 장소별 리뷰 텍스트 |
| `tags` | `{[id]: string[]}` | 장소별 사용자 태그 |
| `memos` | `{[id]: string}` | 장소별 메모 |
| `collections` | `{id,name,ids}[]` | 사용자 정의 컬렉션 |
| `filterPresets` | `{name,filters}[]` | 저장된 필터 세트 |
| `gamification` | `{points,level,badges}` | 포인트/레벨/배지 |
| `onboarding-done` | `boolean` | 온보딩 완료 여부 |

### 설계 원칙
- **서버리스**: 모든 사용자 데이터는 클라이언트 localStorage에 저장
- **Zero backend cost**: 데이터 호스팅/DB 비용 없음
- **Offline-first**: 한 번 로드된 데이터는 캐싱됨
- **Privacy-first**: 개인 데이터가 서버로 전송되지 않음

---
*버전 1.0 | 2026-05-14*
