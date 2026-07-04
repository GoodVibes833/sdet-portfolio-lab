# WHATODO-40 — Place: Share (공유 버튼)

**Module**: place  
**Feature**: Share Button (QR / Social)  
**Feature File**: `cypress/e2e/place/share/share.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 장소 상세 페이지에 공유 버튼이 표시된다 | — | not covered |
| AC2 | 공유 버튼 클릭 시 공유 옵션 패널이 열린다 | — | not covered |
| AC3 | QR 코드 옵션이 표시된다 | — | not covered |
| AC4 | QR 코드가 렌더링된다 | — | not covered |
| AC5 | URL 복사 옵션이 표시된다 | — | not covered |
| AC6 | URL 복사 클릭 시 클립보드에 복사된다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- `ShareButton` 컴포넌트 + `qrcode.react` 라이브러리 사용
- 클립보드 API는 `cy.window().its('navigator.clipboard')` 또는 `cy.stub()`으로 테스트
