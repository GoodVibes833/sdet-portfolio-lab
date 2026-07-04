# WHATODO-41 — Onboarding: Onboarding Tour

**Module**: onboarding  
**Feature**: New User Onboarding Tour  
**Feature File**: `cypress/e2e/onboarding/onboarding.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 신규 사용자(onboarding-done = false)에게 온보딩 투어가 표시된다 | — | not covered |
| AC2 | 온보딩 투어에 여러 단계가 있다 | — | not covered |
| AC3 | "다음" 버튼으로 다음 단계로 이동한다 | — | not covered |
| AC4 | 온보딩을 완료하면 다시 표시되지 않는다 (localStorage) | — | not covered |
| AC5 | 온보딩을 건너뛸 수 있다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- localStorage `onboarding-done` boolean 키로 완료 여부 관리
- TC 시작 전 localStorage 초기화 필요: `cy.clearLocalStorage()`
- `OnboardingTour` 컴포넌트가 UI 담당
