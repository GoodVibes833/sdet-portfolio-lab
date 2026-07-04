# WHATODO-06 — Navbar: Navigation & Links

**Module**: navbar  
**Feature**: Global Navigation Bar  
**Feature File**: `cypress/e2e/navbar/navbar.feature`

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 모든 페이지에서 네비바가 표시된다 | `navbar.feature` Scenario 1 | covered |
| AC2 | 게스트 상태에서 네비바에 로그인 버튼이 표시된다 | `navbar.feature` Scenario 2 | covered |
| AC3 | 네비바의 앱 로고/이름을 클릭하면 홈(/)으로 이동한다 | `navbar.feature` Scenario 3 | covered |
| AC4 | 네비바에 랭킹 링크가 있고 클릭하면 `/ranking`으로 이동한다 | `navbar.feature` Scenario 4 | covered |
| AC5 | 네비바에 친구 링크가 있고 클릭하면 `/friends`로 이동한다 | `navbar.feature` Scenario 5 | covered |
| AC6 | 네비바에 Explore 링크가 있고 클릭하면 `/explore`로 이동한다 | `navbar.feature` Scenario 6 | covered |

---

## TC 목록

| TC ID | Scenario | AC 커버 | Last Run | Result |
|-------|----------|---------|----------|--------|
| WHATODO-06-TC1 | Navbar is visible on the main map page | AC1 | — | — |
| WHATODO-06-TC2 | Login button is shown for guest users | AC2 | — | — |
| WHATODO-06-TC3 | Logo navigates to home | AC3 | — | — |
| WHATODO-06-TC4 | Ranking link navigates to ranking page | AC4 | — | — |
| WHATODO-06-TC5 | Friends link navigates to friends page | AC5 | — | — |
| WHATODO-06-TC6 | Explore link navigates to explore page | AC6 | — | — |

---

## Notes

- `authSelectors.loginNavBtn` selector 이미 정의됨
- 로그인 후 아바타 → 프로필 링크 전환은 WHATODO-07에서 다룸
