# Product Context — 캐나다가자 (whatodo)

> 에이전트가 TC 작성 전에 반드시 읽는 파일.
> 앱의 구조, 모듈, flow, 컨벤션을 담고 있음.

---

## 앱 개요

- **앱명**: 캐나다가자
- **스택**: Next.js 16 + TypeScript + Tailwind CSS v4 + Supabase + Leaflet
- **로컬 포트**: 3001
- **배포**: Vercel

---

## 모듈 목록

| 모듈 | URL / 위치 | 기능 |
|------|-----------|------|
| **map** | `/` | 메인 지도 (Leaflet), 도시탭, 필터칩(카테고리/실내외/가격), 바텀시트, 내 위치 |
| **explore** | `/explore` | 도시탭 + 카테고리/가격 필터 + 검색 + 장소 카운트 |
| **place** | `/place/[id]` | 장소 상세 (rating, 카테고리, 히든스팟, 공식웹사이트, 주소, bestSeason, 이미지) |
| **auth** | 모달 | Google OAuth 로그인 (Supabase) |
| **friends** | `/friends` | 친구 목록/요청/검색 (친구목록·메시지·초대 3탭) |
| **friends-feed** | `/friends/[userId]` | 친구 방문장소 피드 + 채팅 버튼 |
| **chat** | `/friends/chat/[userId]` | 1:1 실시간 채팅 (날짜구분·읽음표시·Enter전송) |
| **ranking** | `/ranking` | 리더보드 (포인트/방문수/뱃지 3탭, 데모 fallback) |
| **hidden** | `/hidden` | 히든 스팟 전용 페이지 |
| **profile** | `/profile` | 프로필 |
| **navbar** | 공통 컴포넌트 | 앱 로고, 로그인/아바타, Explore·Ranking·Friends 링크 |
| **map-legacy** | `/map` | 레거시 지도 (목록형) |
| **tips** | `/tips` | 워홀러 꿀팁 |
| **community** | `/community` | 커뮤니티 |
| **missions** | `/missions` | 미션 |
| **favorites** | place 상세 | 찜하기 (localStorage `favorites`) |
| **visited** | place 상세 | 방문 표시 (localStorage `visited`) |
| **review** | place 상세 | 리뷰 작성/수정/삭제 (localStorage `reviews`) |
| **memo** | place 상세 | 메모 (localStorage `memos`) |
| **tags** | place 상세 | 태그 관리 (localStorage `tags`) |
| **collections** | 전역 | 컬렉션 CRUD (localStorage `collections`) |
| **gamification** | 전역 | 포인트/레벨/뱃지/룰렛 (localStorage `gamification`) |
| **share** | place 상세 | QR·URL 공유 (ShareButton 컴포넌트) |
| **onboarding** | 전역 모달 | 신규 유저 투어 (localStorage `onboarding-done`) |
| **settings** | 설정 패널 | 폰트/고대비 설정 (SettingsPanel 컴포넌트) |
| **pwa** | 전역 | PWA manifest + Service Worker |
| **error** | 전역 | 에러 핸들링 / 404 |
| **responsive** | 전역 | 모바일/태블릿 레이아웃 |
| **filter-presets** | explore | 필터 프리셋 저장/불러오기 (localStorage `filterPresets`) |
| **export** | 전역 | CSV/프린트 (ExportButtons 컴포넌트) |
| **guide** | 전역 | 도움말 패널 (GuidePanel 컴포넌트) |

---

## 핵심 Flow

```
비로그인 사용자:
/ (지도) → /explore → /place/[id] → 로그인 모달

로그인 사용자:
/ → /explore → /place/[id] → 방문 표시 / 친구 초대
→ /friends → /friends/[userId] → /friends/chat/[userId]
→ /ranking
```

---

## 데이터 구조

- 도시: 토론토(46), 밴쿠버(22), 캘거리(14), 몬트리올(14), 오타와(10), 빅토리아(10), 에드먼턴(10), 위니펙(8)
- 히든 스팟: 토론토에 12개 포함
- Place 필드: id, name, category, rating, address, description, isHidden, officialWebsite, sourceLinks, bestSeason, coordinates

---

## 태그 컨벤션

```
@<module> @<ticket> @<ac>
예: @map @WHATODO-12 @AC1
```

모듈 태그:
```
@map @explore @place @auth @friends @chat @ranking @hidden @profile
@navbar @tips @community @missions @collections @gamification
@share @onboarding @settings @pwa @error @responsive @guide @export @navigation
```

우선순위 태그: `@smoke` (핵심 TC), `@regression` (전체)  
localStorage 관련: `@localstorage`  
로그인 필요: `@requires-auth`  
Supabase 필요: `@requires-supabase`

---

## 파일 위치 컨벤션

```
tests/e2e/
├── cypress/
│   ├── e2e/
│   │   └── [module]/[feature-name]/[scenario].feature
│   ├── step_definitions/
│   │   └── [module]/[module].steps.ts
│   └── support/
│       ├── selectors/
│       │   └── [module]/[module].selectors.ts
│       ├── commands.ts
│       └── e2e.ts
└── .agent/
    ├── product-context.md       ← 지금 이 파일
    ├── AGENT-DESIGN.md
    └── skills/
```

---

## 알려진 제약

- Google OAuth는 E2E에서 직접 테스트 불가 → 로그인 모달 UI만 검증
- Supabase `.env.local` 미설정 시 앱 크래시 → 로컬 실행 전 확인 필요
- Leaflet 지도는 로딩에 시간 필요 → `waitForMapToLoad()` 커스텀 커맨드 사용
- `data-testid` 없는 element는 selector 파일에 추가 후 작성
