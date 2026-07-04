# WHATODO-44 — Error Handling: App Error States

**Module**: error  
**Feature**: Error Handling & Fallback UI  
**Feature File**: `cypress/e2e/error/error-handling.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 존재하지 않는 장소 ID로 접근 시 에러 페이지가 표시된다 | — | not covered |
| AC2 | 존재하지 않는 경로로 접근 시 404 페이지가 표시된다 | — | not covered |
| AC3 | 네트워크 오류 시 앱이 크래시 없이 에러 메시지를 표시한다 | — | not covered |
| AC4 | Supabase 미연결 상태에서도 앱이 크래시 없이 실행된다 | — | not covered |
| AC5 | 콘솔에 예상치 못한 에러가 없다 (smoke 페이지 기준) | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- AC4: 이미 `src/lib/supabase.ts`에서 placeholder 방어 처리됨 → 동작 확인 수준
- 콘솔 에러 감지: `cy.on('uncaught:exception', ...)` 또는 `cy.window().its('console.error')` stub
