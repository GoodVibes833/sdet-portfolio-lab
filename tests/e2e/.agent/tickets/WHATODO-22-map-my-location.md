# WHATODO-22 — Map: My Location Button

**Module**: map  
**Feature**: My Location Button  
**Feature File**: `cypress/e2e/map/my-location/my-location.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 메인 지도 페이지에 "내 위치" 버튼이 표시된다 | — | not covered |
| AC2 | 위치 권한이 없을 때 내 위치 버튼이 에러 없이 처리된다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- `mapSelectors.myLocationBtn` selector 이미 정의됨
- Cypress에서 geolocation은 `cy.stub(navigator.geolocation, 'getCurrentPosition')`으로 mock 가능
- 실제 위치 이동 검증은 mock 좌표 기반으로 가능
