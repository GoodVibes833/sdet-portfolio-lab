# WHATODO-01 — Auth: Login Modal

**Module**: auth  
**Feature**: Login Modal  
**Feature File**: `cypress/e2e/auth/login/login-modal.feature`

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 게스트 유저가 네비바의 로그인 버튼을 클릭하면 로그인 모달이 열린다 | `login-modal.feature` Scenario 1 | covered |
| AC2 | 로그인 모달에 Google 로그인 버튼이 표시된다 | `login-modal.feature` Scenario 1 | covered |
| AC3 | 모달의 X 버튼을 클릭하면 모달이 닫힌다 | `login-modal.feature` Scenario 2 | covered |
| AC4 | 모달 바깥 영역을 클릭하면 모달이 닫힌다 | `login-modal.feature` Scenario 3 | covered |

---

## TC 목록

| TC ID | Scenario | 파일 위치 |
|-------|----------|-----------|
| WHATODO-01-TC1 | Login modal opens when login button is clicked | `cypress/e2e/auth/login/login-modal.feature:7` |
| WHATODO-01-TC2 | Login modal closes when X button is clicked | `cypress/e2e/auth/login/login-modal.feature:13` |
| WHATODO-01-TC3 | Login modal closes when clicking outside | `cypress/e2e/auth/login/login-modal.feature:18` |

---

## Notes

- Google OAuth 실제 로그인 플로우는 E2E 테스트 범위 밖 (OAuth redirect 불가)
- 로그인 완료 후 유저 아바타 표시는 `authSelectors.userAvatar`로 검증 가능하나 현재 TC 없음 → future scope
