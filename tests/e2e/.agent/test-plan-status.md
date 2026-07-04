# Test Plan Status — 캐나다가자 (whatodo)

> 업데이트 기준: 새 TC 실행 후 result / last run 갱신. AC 추가 시 coverage 재계산.

---

## 전체 요약

| 지표 | 값 |
|------|----|
| **총 티켓 수** | 30 |
| **총 AC 수** | 88 |
| **Covered AC** | 25 |
| **Not Covered AC** | 63 |
| **AC Coverage** | 28% (25/88) |
| **총 TC 수** | 25 |
| **Last Run** | — (미실행) |
| **Pass Rate** | — |

---

## 티켓 인덱스

| 티켓 | 모듈 | AC 수 | Covered | Coverage | TC 있음 |
|------|------|-------|---------|----------|---------|
| [WHATODO-01](#whatodo-01) | auth | 4 | 4 | 100% | ✅ |
| [WHATODO-02](#whatodo-02) | explore | 7 | 5 | 71% | ✅ |
| [WHATODO-03](#whatodo-03) | map | 6 | 5 | 83% | ✅ |
| [WHATODO-04](#whatodo-04) | map | 6 | 4 | 67% | ✅ |
| [WHATODO-05](#whatodo-05) | place | 10 | 6 | 60% | ✅ |
| [WHATODO-06](#whatodo-06) | navbar | 6 | 6 | 100% | ✅ |
| [WHATODO-07](#whatodo-07) | map | 5 | 0 | 0% | ❌ |
| [WHATODO-08](#whatodo-08) | hidden | 6 | 0 | 0% | ❌ |
| [WHATODO-09](#whatodo-09) | ranking | 6 | 0 | 0% | ❌ |
| [WHATODO-10](#whatodo-10) | profile | 3 | 0 | 0% | ❌ |
| [WHATODO-11](#whatodo-11) | friends | 6 | 0 | 0% | ❌ |
| [WHATODO-12](#whatodo-12) | friends | 4 | 0 | 0% | ❌ |
| [WHATODO-13](#whatodo-13) | chat | 5 | 0 | 0% | ❌ |
| [WHATODO-14](#whatodo-14) | place | 4 | 0 | 0% | ❌ |
| [WHATODO-15](#whatodo-15) | tips | 3 | 0 | 0% | ❌ |
| [WHATODO-16](#whatodo-16) | community | 2 | 0 | 0% | ❌ |
| [WHATODO-17](#whatodo-17) | missions | 3 | 0 | 0% | ❌ |
| [WHATODO-18](#whatodo-18) | map-legacy | 4 | 0 | 0% | ❌ |
| [WHATODO-19](#whatodo-19) | explore | 5 | 0 | 0% | ❌ |
| [WHATODO-20](#whatodo-20) | explore | 4 | 0 | 0% | ❌ |
| [WHATODO-21](#whatodo-21) | place | 3 | 0 | 0% | ❌ |
| [WHATODO-22](#whatodo-22) | map | 2 | 0 | 0% | ❌ |
| [WHATODO-23](#whatodo-23) | map | 4 | 0 | 0% | ❌ |
| [WHATODO-24](#whatodo-24) | auth | 3 | 0 | 0% | ❌ |
| [WHATODO-25](#whatodo-25) | ranking | 4 | 0 | 0% | ❌ |
| [WHATODO-26](#whatodo-26) | friends | 4 | 0 | 0% | ❌ |
| [WHATODO-27](#whatodo-27) | explore | 3 | 0 | 0% | ❌ |
| [WHATODO-28](#whatodo-28) | map | 4 | 0 | 0% | ❌ |
| [WHATODO-29](#whatodo-29) | map | 4 | 0 | 0% | ❌ |
| [WHATODO-30](#whatodo-30) | navigation | 10 | 0 | 0% | ❌ |

---

## WHATODO-01 — Auth: Login Modal

**AC 파일**: `.agent/ac/WHATODO-01-auth-login-modal.md`  
**Feature 파일**: `cypress/e2e/auth/login/login-modal.feature`

| TC ID | Scenario | AC 커버 | Last Run | Result |
|-------|----------|---------|----------|--------|
| WHATODO-01-TC1 | Login modal opens when login button is clicked | AC1, AC2 | — | — |
| WHATODO-01-TC2 | Login modal closes when X button is clicked | AC3 | — | — |
| WHATODO-01-TC3 | Login modal closes when clicking outside | AC4 | — | — |

| AC | 상태 |
|----|------|
| AC1 — 로그인 버튼 클릭 시 모달 열림 | ✅ covered |
| AC2 — Google 로그인 버튼 표시 | ✅ covered |
| AC3 — X 버튼으로 모달 닫힘 | ✅ covered |
| AC4 — 외부 클릭으로 모달 닫힘 | ✅ covered |

**Coverage**: 4/4 (100%)

---

## WHATODO-02 — Explore: Search and Filter

**AC 파일**: `.agent/ac/WHATODO-02-explore-search-filter.md`  
**Feature 파일**: `cypress/e2e/explore/search/search-and-filter.feature`

| TC ID | Scenario | AC 커버 | Last Run | Result |
|-------|----------|---------|----------|--------|
| WHATODO-02-TC1 | Search for a place by name | AC1 | — | — |
| WHATODO-02-TC2 | Search returns no results for unknown place | AC2 | — | — |
| WHATODO-02-TC3 | Clear search input | AC3 | — | — |
| WHATODO-02-TC4 | Filter by category | AC4 | — | — |
| WHATODO-02-TC5 | Filter hidden spots only | AC5 | — | — |

| AC | 상태 |
|----|------|
| AC1 — 검색어 매칭 결과 표시 | ✅ covered |
| AC2 — 결과 없음 메시지 | ✅ covered |
| AC3 — 검색 초기화 | ✅ covered |
| AC4 — 카테고리 필터 | ✅ covered |
| AC5 — 히든 스팟 필터 | ✅ covered |
| AC6 — 도시 탭 전환 | ❌ not covered |
| AC7 — 가격 필터 | ❌ not covered |

**Coverage**: 5/7 (71%)

---

## WHATODO-03 — Map: City Tab Navigation

**AC 파일**: `.agent/ac/WHATODO-03-map-city-tab.md`  
**Feature 파일**: `cypress/e2e/map/city-tab/switch-city.feature`

| TC ID | Scenario | AC 커버 | Last Run | Result |
|-------|----------|---------|----------|--------|
| WHATODO-03-TC1 | Default city is Toronto | AC1, AC2 | — | — |
| WHATODO-03-TC2 | Switch to Vancouver | AC3, AC4 | — | — |
| WHATODO-03-TC3 | Switch between multiple cities | AC5 | — | — |

| AC | 상태 |
|----|------|
| AC1 — 기본 도시 Toronto | ✅ covered |
| AC2 — Toronto 탭 active 기본값 | ✅ covered |
| AC3 — 탭 클릭 시 active 전환 | ✅ covered |
| AC4 — 전환 후 해당 도시 마커 표시 | ✅ covered |
| AC5 — 다중 전환 후 마지막 탭 active | ✅ covered |
| AC6 — 지도 센터링 | ❌ not covered |

**Coverage**: 5/6 (83%)

---

## WHATODO-04 — Map: Place Filter by Category

**AC 파일**: `.agent/ac/WHATODO-04-map-place-filter.md`  
**Feature 파일**: `cypress/e2e/map/place-filter/filter-by-category.feature`

| TC ID | Scenario | AC 커버 | Last Run | Result |
|-------|----------|---------|----------|--------|
| WHATODO-04-TC1 | Filter places by Food category | AC1, AC2 | — | — |
| WHATODO-04-TC2 | Filter places by Outdoor category | AC1 | — | — |
| WHATODO-04-TC3 | Clear filter to show all places | AC3 | — | — |
| WHATODO-04-TC4 | Filter by multiple categories | AC4 | — | — |

| AC | 상태 |
|----|------|
| AC1 — 카테고리 필터 시 해당 마커만 표시 | ✅ covered |
| AC2 — 필터 적용 시 바텀시트도 필터됨 | ✅ covered |
| AC3 — 필터 재클릭 시 해제 | ✅ covered |
| AC4 — 다중 카테고리 동시 선택 | ✅ covered |
| AC5 — 필터칩 active 시각적 표시 | ❌ not covered |
| AC6 — Indoor/Outdoor 필터 | ❌ not covered |

**Coverage**: 4/6 (67%)

---

## WHATODO-05 — Place: Place Detail Page

**AC 파일**: `.agent/ac/WHATODO-05-place-detail.md`  
**Feature 파일**: `cypress/e2e/place/place-detail/view-place-detail.feature`

| TC ID | Scenario | AC 커버 | Last Run | Result |
|-------|----------|---------|----------|--------|
| WHATODO-05-TC1 | Navigate to place detail page | AC1, AC2, AC3 | — | — |
| WHATODO-05-TC2 | Place detail shows rating | AC4 | — | — |
| WHATODO-05-TC3 | Hidden spot badge is shown for hidden spots | AC5 | — | — |
| WHATODO-05-TC4 | Official website link is clickable | AC6 | — | — |

| AC | 상태 |
|----|------|
| AC1 — 카드 클릭 시 상세 페이지 이동 | ✅ covered |
| AC2 — 장소 이름 표시 | ✅ covered |
| AC3 — 카테고리 표시 | ✅ covered |
| AC4 — 평점 표시 | ✅ covered |
| AC5 — 히든 스팟 배지 표시 | ✅ covered |
| AC6 — 공식 웹사이트 링크 표시 | ✅ covered |
| AC7 — 주소 표시 | ❌ not covered |
| AC8 — bestSeason 표시 | ❌ not covered |
| AC9 — 로그인 유저: 방문 표시 버튼 | ❌ not covered |
| AC10 — 로그인 유저: 친구 초대 버튼 | ❌ not covered |

**Coverage**: 6/10 (60%)

---

## WHATODO-06 — Navbar: Navigation & Links

**AC 파일**: `.agent/ac/WHATODO-06-navbar.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 모든 페이지에서 네비바 표시 | ❌ not covered |
| AC2 — 게스트 상태에서 로그인 버튼 표시 | ❌ not covered |
| AC3 — 로고 클릭 시 홈으로 이동 | ❌ not covered |
| AC4 — 랭킹 링크 → `/ranking` 이동 | ❌ not covered |
| AC5 — 친구 링크 → `/friends` 이동 | ❌ not covered |
| AC6 — Explore 링크 → `/explore` 이동 | ❌ not covered |

**Coverage**: 0/6 (0%)

---

## WHATODO-07 — Map: Bottom Sheet Place List

**AC 파일**: `.agent/ac/WHATODO-07-map-bottomsheet.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 바텀시트 표시 | ❌ not covered |
| AC2 — 장소 카드 1개 이상 표시 | ❌ not covered |
| AC3 — 카드 클릭 시 상세 페이지 이동 | ❌ not covered |
| AC4 — 필터 적용 시 바텀시트도 갱신 | ❌ not covered |
| AC5 — 도시 탭 전환 시 바텀시트도 갱신 | ❌ not covered |

**Coverage**: 0/5 (0%)

---

## WHATODO-08 — Hidden Spots: Hidden Spots Page

**AC 파일**: `.agent/ac/WHATODO-08-hidden-spots-page.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/hidden` 접근 가능 | ❌ not covered |
| AC2 — 히든 스팟 장소 표시 | ❌ not covered |
| AC3 — 도시 탭으로 필터링 | ❌ not covered |
| AC4 — 카테고리 필터 동작 | ❌ not covered |
| AC5 — 검색 동작 | ❌ not covered |
| AC6 — 카드 클릭 시 상세 페이지 이동 | ❌ not covered |

**Coverage**: 0/6 (0%)

---

## WHATODO-09 — Ranking: Leaderboard Page

**AC 파일**: `.agent/ac/WHATODO-09-ranking-leaderboard.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/ranking` 접근 가능 | ❌ not covered |
| AC2 — 3개 탭(포인트/방문수/뱃지) 표시 | ❌ not covered |
| AC3 — 포인트 탭 리더보드 표시 | ❌ not covered |
| AC4 — 방문수 탭 리더보드 표시 | ❌ not covered |
| AC5 — 뱃지 탭 리더보드 표시 | ❌ not covered |
| AC6 — 유저 아이템 1개 이상 표시 (데모 fallback) | ❌ not covered |

**Coverage**: 0/6 (0%)

---

## WHATODO-10 — Profile: Profile Page

**AC 파일**: `.agent/ac/WHATODO-10-profile-page.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/profile` 접근 가능 | ❌ not covered |
| AC2 — 페이지 정상 렌더링 | ❌ not covered |
| AC3 — 게스트 접근 시 로그인 유도 표시 | ❌ not covered |

**Coverage**: 0/3 (0%)

---

## WHATODO-11 — Friends: Main Page

**AC 파일**: `.agent/ac/WHATODO-11-friends-main.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/friends` 접근 가능 | ❌ not covered |
| AC2 — 3개 탭(친구목록/메시지/초대) 표시 | ❌ not covered |
| AC3 — 친구 검색 기능 표시 | ❌ not covered |
| AC4 — 메시지 탭: 채팅 바로가기 목록 | ❌ not covered |
| AC5 — 초대 탭: 수락/거절 가능 | ❌ not covered |
| AC6 — 게스트 접근 시 로그인 유도 | ❌ not covered |

**Coverage**: 0/6 (0%)

---

## WHATODO-12 — Friends: Friend Visit Feed

**AC 파일**: `.agent/ac/WHATODO-12-friends-feed.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/friends/[userId]` 정상 렌더링 | ❌ not covered |
| AC2 — 방문 장소 목록 표시 | ❌ not covered |
| AC3 — 채팅 버튼 표시 | ❌ not covered |
| AC4 — 채팅 버튼 클릭 시 채팅 페이지 이동 | ❌ not covered |

**Coverage**: 0/4 (0%)

---

## WHATODO-13 — Chat: 1:1 Realtime Chat

**AC 파일**: `.agent/ac/WHATODO-13-chat.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/friends/chat/[userId]` 정상 렌더링 | ❌ not covered |
| AC2 — 채팅 입력창 표시 | ❌ not covered |
| AC3 — Enter 키로 메시지 전송 | ❌ not covered |
| AC4 — 날짜 구분선 표시 | ❌ not covered |
| AC5 — 읽음 표시 | ❌ not covered |

**Coverage**: 0/5 (0%)

---

## WHATODO-14 — Place: Friend Invite Feature

**AC 파일**: `.agent/ac/WHATODO-14-invite.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 로그인 유저에게 초대 버튼 표시 | ❌ not covered |
| AC2 — 초대 모달 열림 | ❌ not covered |
| AC3 — 친구 목록 표시 | ❌ not covered |
| AC4 — 초대 전송 후 구글 캘린더 링크 제공 | ❌ not covered |

**Coverage**: 0/4 (0%)

---

## WHATODO-15 — Tips: Working Holiday Tips Page

**AC 파일**: `.agent/ac/WHATODO-15-tips-page.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/tips` 접근 가능 | ❌ not covered |
| AC2 — 페이지 정상 렌더링 | ❌ not covered |
| AC3 — 팁 콘텐츠 1개 이상 표시 | ❌ not covered |

**Coverage**: 0/3 (0%)

---

## WHATODO-16 — Community: Community Page

**AC 파일**: `.agent/ac/WHATODO-16-community-page.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/community` 접근 가능 | ❌ not covered |
| AC2 — 페이지 정상 렌더링 | ❌ not covered |

**Coverage**: 0/2 (0%)

---

## WHATODO-17 — Missions: Missions Page

**AC 파일**: `.agent/ac/WHATODO-17-missions-page.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/missions` 접근 가능 | ❌ not covered |
| AC2 — 페이지 정상 렌더링 | ❌ not covered |
| AC3 — 미션 목록 1개 이상 표시 | ❌ not covered |

**Coverage**: 0/3 (0%)

---

## WHATODO-18 — Map Legacy: List-style Map Page

**AC 파일**: `.agent/ac/WHATODO-18-map-legacy.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/map` 접근 가능 | ❌ not covered |
| AC2 — 페이지 정상 렌더링 | ❌ not covered |
| AC3 — 지도 마커 1개 이상 표시 | ❌ not covered |
| AC4 — 장소 선택 시 상세 정보 표시 | ❌ not covered |

**Coverage**: 0/4 (0%)

---

## WHATODO-19 — Explore: City Tab Switching

**AC 파일**: `.agent/ac/WHATODO-19-explore-city-tab.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 도시 탭 표시 | ❌ not covered |
| AC2 — 기본 탭 active 상태 | ❌ not covered |
| AC3 — 탭 클릭 시 해당 도시 장소 표시 | ❌ not covered |
| AC4 — 탭 전환 시 카드 목록 갱신 | ❌ not covered |
| AC5 — 탭 전환 시 검색/필터 초기화 | ❌ not covered |

**Coverage**: 0/5 (0%)

---

## WHATODO-20 — Explore: Price Filter

**AC 파일**: `.agent/ac/WHATODO-20-explore-price-filter.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 가격 필터(무료/유료) 표시 | ❌ not covered |
| AC2 — 무료 필터: 무료 장소만 표시 | ❌ not covered |
| AC3 — 유료 필터: 유료 장소만 표시 | ❌ not covered |
| AC4 — 필터 재클릭 시 해제 | ❌ not covered |

**Coverage**: 0/4 (0%)

---

## WHATODO-21 — Place: Address & Best Season Display

**AC 파일**: `.agent/ac/WHATODO-21-place-address-season.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 주소 표시 | ❌ not covered |
| AC2 — bestSeason 표시 | ❌ not covered |
| AC3 — source links 섹션 표시 | ❌ not covered |

**Coverage**: 0/3 (0%)

---

## WHATODO-22 — Map: My Location Button

**AC 파일**: `.agent/ac/WHATODO-22-map-my-location.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 내 위치 버튼 표시 | ❌ not covered |
| AC2 — 위치 권한 없을 때 에러 없이 처리 | ❌ not covered |

**Coverage**: 0/2 (0%)

---

## WHATODO-23 — Map: Place Markers & Cluster

**AC 파일**: `.agent/ac/WHATODO-23-map-markers.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 마커 1개 이상 표시 | ❌ not covered |
| AC2 — 마커 클릭 시 장소 정보 표시 | ❌ not covered |
| AC3 — 줌 아웃 시 클러스터 표시 | ❌ not covered |
| AC4 — 클러스터 클릭 시 줌 인 | ❌ not covered |

**Coverage**: 0/4 (0%)

---

## WHATODO-24 — Auth: Logged-in State UI

**AC 파일**: `.agent/ac/WHATODO-24-auth-logged-in-state.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 로그인 후 유저 아바타 표시 | ❌ not covered |
| AC2 — 로그인 후 로그인 버튼 사라짐 | ❌ not covered |
| AC3 — 아바타 클릭 시 프로필로 이동 | ❌ not covered |

**Coverage**: 0/3 (0%)

---

## WHATODO-25 — Ranking: Tab Switching & Content

**AC 파일**: `.agent/ac/WHATODO-25-ranking-tabs.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 탭 간 전환 동작 | ❌ not covered |
| AC2 — 탭 클릭 시 active 변경 | ❌ not covered |
| AC3 — 각 탭 콘텐츠 표시 | ❌ not covered |
| AC4 — 1~3위 시각적 강조 표시 | ❌ not covered |

**Coverage**: 0/4 (0%)

---

## WHATODO-26 — Friends: Search Friend

**AC 파일**: `.agent/ac/WHATODO-26-friends-search.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 친구 검색 입력창 표시 | ❌ not covered |
| AC2 — 검색어 입력 시 매칭 유저 표시 | ❌ not covered |
| AC3 — 결과 없을 때 안내 메시지 표시 | ❌ not covered |
| AC4 — 친구 추가 요청 전송 가능 | ❌ not covered |

**Coverage**: 0/4 (0%)

---

## WHATODO-27 — Explore: Place Count Display

**AC 파일**: `.agent/ac/WHATODO-27-explore-place-count.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 장소 수 표시 | ❌ not covered |
| AC2 — 필터 적용 시 수 업데이트 | ❌ not covered |
| AC3 — 검색 시 수 업데이트 | ❌ not covered |

**Coverage**: 0/3 (0%)

---

## WHATODO-28 — Map: Indoor/Outdoor Filter

**AC 파일**: `.agent/ac/WHATODO-28-map-indoor-outdoor-filter.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — Indoor/Outdoor 필터칩 표시 | ❌ not covered |
| AC2 — Indoor 필터: 실내 마커만 표시 | ❌ not covered |
| AC3 — Outdoor 필터: 야외 마커만 표시 | ❌ not covered |
| AC4 — 필터 재클릭 시 해제 | ❌ not covered |

**Coverage**: 0/4 (0%)

---

## WHATODO-29 — Map: Price Filter

**AC 파일**: `.agent/ac/WHATODO-29-map-price-filter.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — 가격 필터칩(무료/유료) 표시 | ❌ not covered |
| AC2 — 무료 필터: 무료 마커만 표시 | ❌ not covered |
| AC3 — 유료 필터: 유료 마커만 표시 | ❌ not covered |
| AC4 — 필터 재클릭 시 해제 | ❌ not covered |

**Coverage**: 0/4 (0%)

---

## WHATODO-30 — Navigation: All Pages Smoke Test

**AC 파일**: `.agent/ac/WHATODO-30-page-navigation-smoke.md`  
**Feature 파일**: 미작성

| AC | 상태 |
|----|------|
| AC1 — `/` 렌더링 | ❌ not covered |
| AC2 — `/explore` 렌더링 | ❌ not covered |
| AC3 — `/map` 렌더링 | ❌ not covered |
| AC4 — `/tips` 렌더링 | ❌ not covered |
| AC5 — `/community` 렌더링 | ❌ not covered |
| AC6 — `/missions` 렌더링 | ❌ not covered |
| AC7 — `/profile` 렌더링 | ❌ not covered |
| AC8 — `/ranking` 렌더링 | ❌ not covered |
| AC9 — `/hidden` 렌더링 | ❌ not covered |
| AC10 — `/friends` 렌더링 | ❌ not covered |

**Coverage**: 0/10 (0%)

---

## Not Covered 우선순위 (다음 작업 가이드)

| 우선순위 | 티켓 | 이유 |
|----------|------|------|
| 🔴 즉시 | WHATODO-30 | 전체 smoke — 다른 TC의 선행 조건 |
| 🔴 즉시 | WHATODO-06 | Navbar — 모든 페이지 공통 |
| 🟠 높음 | WHATODO-09, WHATODO-25 | Ranking — 로그인 불필요, 데모 fallback |
| 🟠 높음 | WHATODO-08 | Hidden spots — 로그인 불필요 |
| 🟠 높음 | WHATODO-15, WHATODO-16, WHATODO-17 | Tips/Community/Missions — 로그인 불필요 |
| 🟡 중간 | WHATODO-19, WHATODO-20, WHATODO-27 | Explore 추가 기능 — selector 이미 있음 |
| 🟡 중간 | WHATODO-07, WHATODO-23 | Map bottomsheet/markers |
| 🔵 나중 | WHATODO-11~14, WHATODO-24, WHATODO-26 | 로그인/Supabase 의존 기능 |
