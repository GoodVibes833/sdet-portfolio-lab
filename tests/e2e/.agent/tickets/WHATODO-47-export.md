# WHATODO-47 — Export: CSV / Print

**Module**: export  
**Feature**: Export Buttons (CSV / Print)  
**Feature File**: `cypress/e2e/export/export.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | CSV 내보내기 버튼이 표시된다 | — | not covered |
| AC2 | CSV 내보내기 버튼 클릭 시 파일이 다운로드된다 | — | not covered |
| AC3 | 프린트 버튼이 표시된다 | — | not covered |
| AC4 | 프린트 버튼 클릭 시 프린트 다이얼로그가 열린다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- `ExportButtons` 컴포넌트가 UI 담당
- 파일 다운로드 검증: `cy.readFile()` 또는 download event 감지
- 프린트: `cy.stub(window, 'print')` 으로 호출 여부 확인
