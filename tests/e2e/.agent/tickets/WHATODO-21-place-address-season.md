# WHATODO-21 — Place: Address & Best Season Display

**Module**: place  
**Feature**: Place Detail Additional Info (Address, Best Season)  
**Feature File**: `cypress/e2e/place/place-detail-info.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 장소 상세 페이지에 주소(address)가 표시된다 | — | not covered |
| AC2 | 장소 상세 페이지에 bestSeason 정보가 표시된다 (해당 데이터 있는 경우) | — | not covered |
| AC3 | 장소 상세 페이지에 source links 섹션이 표시된다 (해당 데이터 있는 경우) | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- `placeSelectors.placeAddress`, `placeSelectors.bestSeasonBadge`, `placeSelectors.sourceLinksSection` selector 이미 정의됨
- WHATODO-05 AC7, AC8에서 not covered로 식별된 항목을 별도 티켓으로 분리
- bestSeason이 없는 장소도 있으므로 TC에서 조건부 검증 필요
