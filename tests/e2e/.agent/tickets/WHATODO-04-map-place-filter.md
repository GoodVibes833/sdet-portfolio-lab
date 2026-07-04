# WHATODO-04 — Map: Place Filter by Category

**Module**: map  
**Feature**: Place Filter by Category  
**Feature File**: `cypress/e2e/map/place-filter/filter-by-category.feature`

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 카테고리 필터칩 클릭 시 해당 카테고리의 마커만 지도에 표시된다 | `filter-by-category.feature` Scenario 1, 2 | covered |
| AC2 | 필터 적용 시 바텀시트에도 해당 카테고리 장소만 표시된다 | `filter-by-category.feature` Scenario 1 | covered |
| AC3 | 이미 선택된 필터칩을 다시 클릭하면 필터가 해제되고 전체 마커가 표시된다 | `filter-by-category.feature` Scenario 3 | covered |
| AC4 | 여러 카테고리를 동시에 선택하면 해당 카테고리들의 장소가 모두 표시된다 | `filter-by-category.feature` Scenario 4 | covered |
| AC5 | 필터칩은 선택된 상태를 시각적으로 구분할 수 있다 (aria-pressed="true") | — | not covered |
| AC6 | 실내/외 필터 (Indoor/Outdoor)로 장소를 필터링할 수 있다 | — | not covered |

---

## TC 목록

| TC ID | Scenario | 파일 위치 |
|-------|----------|-----------|
| WHATODO-04-TC1 | Filter places by Food category | `cypress/e2e/map/place-filter/filter-by-category.feature:10` |
| WHATODO-04-TC2 | Filter places by Outdoor category | `cypress/e2e/map/place-filter/filter-by-category.feature:15` |
| WHATODO-04-TC3 | Clear filter to show all places | `cypress/e2e/map/place-filter/filter-by-category.feature:19` |
| WHATODO-04-TC4 | Filter by multiple categories | `cypress/e2e/map/place-filter/filter-by-category.feature:24` |

---

## Notes

- AC5 (필터 active 상태): `mapSelectors.filterChipActive`로 검증 가능 → TC 추가 가능
- AC6 (Indoor/Outdoor 필터): AGENTS.md에 Indoor/Outdoor 필터 언급 있음 → 별도 TC 필요
- 마커 개수 정확한 검증은 데이터 의존적 → `have.length.greaterThan(0)` 수준 유지 권장
