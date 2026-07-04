# WHATODO-28 — Map: Indoor/Outdoor Filter

**Module**: map  
**Feature**: Indoor/Outdoor Filter Chip  
**Feature File**: `cypress/e2e/map/indoor-outdoor/filter-indoor-outdoor.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 메인 지도 페이지에 Indoor/Outdoor 필터칩이 표시된다 | — | not covered |
| AC2 | Indoor 필터 클릭 시 실내 장소 마커만 표시된다 | — | not covered |
| AC3 | Outdoor 필터 클릭 시 야외 장소 마커만 표시된다 | — | not covered |
| AC4 | 필터 재클릭 시 필터가 해제된다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- AGENTS.md 기준 "필터칩(카테고리/실내외/가격)" 명시됨
- WHATODO-04 AC6에서 not covered로 식별된 항목을 별도 티켓으로 분리
- `mapSelectors.filterChip('Indoor')`, `mapSelectors.filterChip('Outdoor')` 형식으로 selector 사용 가능
