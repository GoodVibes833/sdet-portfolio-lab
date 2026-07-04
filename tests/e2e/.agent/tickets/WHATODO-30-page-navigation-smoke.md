# WHATODO-30 — Navigation: All Pages Smoke Test

**Module**: navigation  
**Feature**: Full Page Navigation Smoke  
**Feature File**: `cypress/e2e/navigation/smoke-navigation.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | `/` 메인 페이지가 크래시 없이 렌더링된다 | — | not covered |
| AC2 | `/explore` 페이지가 크래시 없이 렌더링된다 | — | not covered |
| AC3 | `/map` 페이지가 크래시 없이 렌더링된다 | — | not covered |
| AC4 | `/tips` 페이지가 크래시 없이 렌더링된다 | — | not covered |
| AC5 | `/community` 페이지가 크래시 없이 렌더링된다 | — | not covered |
| AC6 | `/missions` 페이지가 크래시 없이 렌더링된다 | — | not covered |
| AC7 | `/profile` 페이지가 크래시 없이 렌더링된다 | — | not covered |
| AC8 | `/ranking` 페이지가 크래시 없이 렌더링된다 | — | not covered |
| AC9 | `/hidden` 페이지가 크래시 없이 렌더링된다 | — | not covered |
| AC10 | `/friends` 페이지가 크래시 없이 렌더링된다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- 로그인 불필요한 순수 smoke 티켓
- 각 페이지에서 `cy.get('body').should('be.visible')`과 콘솔 에러 없음 검증 조합
- 다른 티켓들의 선행 조건 역할 — 이 티켓이 통과해야 나머지 TC가 의미 있음
- `@smoke @regression` 태그 권장
