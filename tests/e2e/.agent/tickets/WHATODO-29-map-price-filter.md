# WHATODO-29 — Map: Price Filter

**Module**: map  
**Feature**: Price Filter Chip on Map Page  
**Feature File**: `cypress/e2e/map/price-filter/filter-by-price-map.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 메인 지도 페이지에 가격 필터칩(무료/유료)이 표시된다 | — | not covered |
| AC2 | 무료 필터 클릭 시 무료 장소 마커만 표시된다 | — | not covered |
| AC3 | 유료 필터 클릭 시 유료 장소 마커만 표시된다 | — | not covered |
| AC4 | 가격 필터 재클릭 시 필터가 해제된다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- AGENTS.md 기준 "필터칩(카테고리/실내외/가격)" 명시됨
- `mapSelectors.filterChip('Free')`, `mapSelectors.filterChip('Paid')` 형식으로 selector 사용 가능 (실제 data-testid 확인 필요)
