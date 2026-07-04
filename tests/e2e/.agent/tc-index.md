# TC Index — AC별 TC 매핑

> 각 AC에 대해 어떤 TC가 커버하고 있는지 한눈에 보는 파일.  
> TC 작성 완료 시 `skill-update-docs.md`에 따라 이 파일도 업데이트한다.

---

## 사용법

| 컬럼 | 설명 |
|------|------|
| **AC ID** | `WHATODO-XX-ACN` 형식 |
| **AC 내용** | 해당 AC 한 줄 요약 |
| **TC ID** | `WHATODO-XX-TCN` 형식 (없으면 `—`) |
| **Feature 파일** | `cypress/e2e/...` 경로:라인번호 |
| **상태** | ✅ covered / ❌ not covered / 🔄 in progress |

---

## WHATODO-01 — Auth: Login Modal

| AC ID | AC 내용 | TC ID | Feature 파일 | 상태 |
|-------|---------|-------|-------------|------|
| WHATODO-01-AC1 | 로그인 버튼 클릭 시 모달 열림 | WHATODO-01-TC1 | `auth/login/login-modal.feature:7` | ✅ |
| WHATODO-01-AC2 | Google 로그인 버튼 표시 | WHATODO-01-TC1 | `auth/login/login-modal.feature:7` | ✅ |
| WHATODO-01-AC3 | X 버튼으로 모달 닫힘 | WHATODO-01-TC2 | `auth/login/login-modal.feature:13` | ✅ |
| WHATODO-01-AC4 | 외부 클릭으로 모달 닫힘 | WHATODO-01-TC3 | `auth/login/login-modal.feature:18` | ✅ |

---

## WHATODO-02 — Explore: Search and Filter

| AC ID | AC 내용 | TC ID | Feature 파일 | 상태 |
|-------|---------|-------|-------------|------|
| WHATODO-02-AC1 | 검색어 매칭 결과 표시 | WHATODO-02-TC1 | `explore/search/search-and-filter.feature:10` | ✅ |
| WHATODO-02-AC2 | 결과 없음 메시지 | WHATODO-02-TC2 | `explore/search/search-and-filter.feature:14` | ✅ |
| WHATODO-02-AC3 | 검색 초기화 | WHATODO-02-TC3 | `explore/search/search-and-filter.feature:18` | ✅ |
| WHATODO-02-AC4 | 카테고리 필터 | WHATODO-02-TC4 | `explore/search/search-and-filter.feature:23` | ✅ |
| WHATODO-02-AC5 | 히든 스팟 필터 | WHATODO-02-TC5 | `explore/search/search-and-filter.feature:27` | ✅ |
| WHATODO-02-AC6 | 도시 탭 전환 | — | — | ❌ |
| WHATODO-02-AC7 | 가격 필터 | — | — | ❌ |
| WHATODO-02-AC8 | 검색 중 로딩 인디케이터 | — | — | ❌ |
| WHATODO-02-AC9 | 검색+카테고리 동시 필터 | — | — | ❌ |
| WHATODO-02-AC10 | 카드에 이름/카테고리 표시 | — | — | ❌ |
| WHATODO-02-AC11 | 카드에 평점 표시 | — | — | ❌ |
| WHATODO-02-AC12 | 카드 클릭 시 상세 페이지 이동 | — | — | ❌ |

---

## WHATODO-03 — Map: City Tab Navigation

| AC ID | AC 내용 | TC ID | Feature 파일 | 상태 |
|-------|---------|-------|-------------|------|
| WHATODO-03-AC1 | 기본 도시 Toronto | WHATODO-03-TC1 | `map/city-tab/switch-city.feature:10` | ✅ |
| WHATODO-03-AC2 | Toronto 탭 active 기본값 | WHATODO-03-TC1 | `map/city-tab/switch-city.feature:10` | ✅ |
| WHATODO-03-AC3 | 탭 클릭 시 active 전환 | WHATODO-03-TC2 | `map/city-tab/switch-city.feature:14` | ✅ |
| WHATODO-03-AC4 | 전환 후 해당 도시 마커 표시 | WHATODO-03-TC2 | `map/city-tab/switch-city.feature:14` | ✅ |
| WHATODO-03-AC5 | 다중 전환 후 마지막 탭 active | WHATODO-03-TC3 | `map/city-tab/switch-city.feature:19` | ✅ |
| WHATODO-03-AC6 | 지도 센터링 | — | — | ❌ |

---

## WHATODO-04 — Map: Place Filter by Category

| AC ID | AC 내용 | TC ID | Feature 파일 | 상태 |
|-------|---------|-------|-------------|------|
| WHATODO-04-AC1 | 카테고리 필터 시 해당 마커만 표시 | WHATODO-04-TC1, TC2 | `map/place-filter/filter-by-category.feature:10` | ✅ |
| WHATODO-04-AC2 | 필터 적용 시 바텀시트도 필터됨 | WHATODO-04-TC1 | `map/place-filter/filter-by-category.feature:10` | ✅ |
| WHATODO-04-AC3 | 필터 재클릭 시 해제 | WHATODO-04-TC3 | `map/place-filter/filter-by-category.feature:19` | ✅ |
| WHATODO-04-AC4 | 다중 카테고리 동시 선택 | WHATODO-04-TC4 | `map/place-filter/filter-by-category.feature:24` | ✅ |
| WHATODO-04-AC5 | 필터칩 active 시각적 표시 | — | — | ❌ |
| WHATODO-04-AC6 | Indoor/Outdoor 필터 | — | — | ❌ |

---

## WHATODO-05 — Place: Place Detail Page

| AC ID | AC 내용 | TC ID | Feature 파일 | 상태 |
|-------|---------|-------|-------------|------|
| WHATODO-05-AC1 | 카드 클릭 시 상세 페이지 이동 | WHATODO-05-TC1 | `place/place-detail/view-place-detail.feature:10` | ✅ |
| WHATODO-05-AC2 | 장소 이름 표시 | WHATODO-05-TC1 | `place/place-detail/view-place-detail.feature:10` | ✅ |
| WHATODO-05-AC3 | 카테고리 표시 | WHATODO-05-TC1 | `place/place-detail/view-place-detail.feature:10` | ✅ |
| WHATODO-05-AC4 | 평점 표시 | WHATODO-05-TC2 | `place/place-detail/view-place-detail.feature:16` | ✅ |
| WHATODO-05-AC5 | 히든 스팟 배지 표시 | WHATODO-05-TC3 | `place/place-detail/view-place-detail.feature:20` | ✅ |
| WHATODO-05-AC6 | 공식 웹사이트 링크 표시 | WHATODO-05-TC4 | `place/place-detail/view-place-detail.feature:24` | ✅ |
| WHATODO-05-AC7 | 주소 표시 | — | — | ❌ |
| WHATODO-05-AC8 | bestSeason 표시 | — | — | ❌ |
| WHATODO-05-AC9 | 로그인 유저: 방문 표시 버튼 | — | — | ❌ |
| WHATODO-05-AC10 | 로그인 유저: 친구 초대 버튼 | — | — | ❌ |
| WHATODO-05-AC11 | 장소 이미지 표시 | — | — | ❌ |
| WHATODO-05-AC12 | 장소 설명 표시 | — | — | ❌ |
| WHATODO-05-AC13 | 뒤로가기 동작 | — | — | ❌ |

---

## WHATODO-06~30 — 신규 TC 없음

> 아래 티켓들은 모든 AC가 not covered 상태. TC 작성 시 이 파일 업데이트 필요.

| 티켓 | 모듈 | AC 수 | 파일 |
|------|------|-------|------|
| WHATODO-06 | navbar | 6 | `tickets/WHATODO-06-navbar.md` |
| WHATODO-07 | map | 5 | `tickets/WHATODO-07-map-bottomsheet.md` |
| WHATODO-08 | hidden | 6 | `tickets/WHATODO-08-hidden-spots-page.md` |
| WHATODO-09 | ranking | 6 | `tickets/WHATODO-09-ranking-leaderboard.md` |
| WHATODO-10 | profile | 3 | `tickets/WHATODO-10-profile-page.md` |
| WHATODO-11 | friends | 6 | `tickets/WHATODO-11-friends-main.md` |
| WHATODO-12 | friends | 4 | `tickets/WHATODO-12-friends-feed.md` |
| WHATODO-13 | chat | 5 | `tickets/WHATODO-13-chat.md` |
| WHATODO-14 | place | 4 | `tickets/WHATODO-14-invite.md` |
| WHATODO-15 | tips | 3 | `tickets/WHATODO-15-tips-page.md` |
| WHATODO-16 | community | 2 | `tickets/WHATODO-16-community-page.md` |
| WHATODO-17 | missions | 3 | `tickets/WHATODO-17-missions-page.md` |
| WHATODO-18 | map-legacy | 4 | `tickets/WHATODO-18-map-legacy.md` |
| WHATODO-19 | explore | 5 | `tickets/WHATODO-19-explore-city-tab.md` |
| WHATODO-20 | explore | 4 | `tickets/WHATODO-20-explore-price-filter.md` |
| WHATODO-21 | place | 3 | `tickets/WHATODO-21-place-address-season.md` |
| WHATODO-22 | map | 2 | `tickets/WHATODO-22-map-my-location.md` |
| WHATODO-23 | map | 4 | `tickets/WHATODO-23-map-markers.md` |
| WHATODO-24 | auth | 3 | `tickets/WHATODO-24-auth-logged-in-state.md` |
| WHATODO-25 | ranking | 4 | `tickets/WHATODO-25-ranking-tabs.md` |
| WHATODO-26 | friends | 4 | `tickets/WHATODO-26-friends-search.md` |
| WHATODO-27 | explore | 3 | `tickets/WHATODO-27-explore-place-count.md` |
| WHATODO-28 | map | 4 | `tickets/WHATODO-28-map-indoor-outdoor-filter.md` |
| WHATODO-29 | map | 4 | `tickets/WHATODO-29-map-price-filter.md` |
| WHATODO-30 | navigation | 10 | `tickets/WHATODO-30-page-navigation-smoke.md` |

---

## WHATODO-31~50 — 신규 TC 없음

| 티켓 | 모듈 | AC 수 | 파일 |
|------|------|-------|------|
| WHATODO-31 | place | 6 | `tickets/WHATODO-31-favorites.md` |
| WHATODO-32 | place | 6 | `tickets/WHATODO-32-visited.md` |
| WHATODO-33 | place | 6 | `tickets/WHATODO-33-review.md` |
| WHATODO-34 | place | 5 | `tickets/WHATODO-34-memo.md` |
| WHATODO-35 | place | 6 | `tickets/WHATODO-35-tags.md` |
| WHATODO-36 | collections | 7 | `tickets/WHATODO-36-collections.md` |
| WHATODO-37 | gamification | 5 | `tickets/WHATODO-37-gamification-points.md` |
| WHATODO-38 | gamification | 6 | `tickets/WHATODO-38-gamification-badges.md` |
| WHATODO-39 | gamification | 5 | `tickets/WHATODO-39-gamification-roulette.md` |
| WHATODO-40 | place | 6 | `tickets/WHATODO-40-share.md` |
| WHATODO-41 | onboarding | 5 | `tickets/WHATODO-41-onboarding.md` |
| WHATODO-42 | settings | 6 | `tickets/WHATODO-42-settings.md` |
| WHATODO-43 | pwa | 5 | `tickets/WHATODO-43-pwa.md` |
| WHATODO-44 | error | 5 | `tickets/WHATODO-44-error-handling.md` |
| WHATODO-45 | responsive | 6 | `tickets/WHATODO-45-responsive-mobile.md` |
| WHATODO-46 | explore | 5 | `tickets/WHATODO-46-filter-presets.md` |
| WHATODO-47 | export | 4 | `tickets/WHATODO-47-export.md` |
| WHATODO-48 | utility | 4 | `tickets/WHATODO-48-world-clock.md` |
| WHATODO-49 | explore | 5 | `tickets/WHATODO-49-search-autocomplete.md` |
| WHATODO-50 | guide | 4 | `tickets/WHATODO-50-guide-panel.md` |

---

## AC 총합

| 구간 | 티켓 수 | AC 수 | Covered | Coverage |
|------|---------|-------|---------|----------|
| WHATODO-01~05 | 5 | 43 | 19 | 44% |
| WHATODO-06~30 | 25 | 97 | 0 | 0% |
| WHATODO-31~50 | 20 | 100 | 0 | 0% |
| **전체** | **50** | **200** | **19** | **9.5%** |
