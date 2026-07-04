# WHATODO-24 — Auth: Logged-in State UI

**Module**: auth  
**Feature**: Logged-in User State Display  
**Feature File**: `cypress/e2e/auth/logged-in-state.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 로그인 후 네비바에 유저 아바타가 표시된다 | — | not covered |
| AC2 | 로그인 후 네비바에서 로그인 버튼이 사라진다 | — | not covered |
| AC3 | 유저 아바타를 클릭하면 프로필 링크로 이동한다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- `authSelectors.userAvatar`, `authSelectors.profileLink` selector 이미 정의됨
- 실제 OAuth 로그인 E2E는 불가 → Supabase session을 localStorage/cookie에 직접 주입하는 방식으로 우회 가능 (cy.session 또는 custom command)
- 현재는 not covered 유지, OAuth 우회 방법 확보 시 TC 작성
