# WHATODO-02 — Explore: Search and Filter

**Module**: explore  
**Feature**: Search and Filter  
**Feature File**: `cypress/e2e/explore/search/search-and-filter.feature`

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 검색창에 장소명을 입력하면 매칭되는 장소만 결과에 표시된다 | `search-and-filter.feature` Scenario 1 | covered |
| AC2 | 존재하지 않는 검색어를 입력하면 "결과 없음" 메시지가 표시된다 | `search-and-filter.feature` Scenario 2 | covered |
| AC3 | 검색창 클리어 버튼을 클릭하면 검색어가 초기화되고 전체 장소가 다시 표시된다 | `search-and-filter.feature` Scenario 3 | covered |
| AC4 | 카테고리 필터를 클릭하면 해당 카테고리 장소만 표시된다 | `search-and-filter.feature` Scenario 4 | covered |
| AC5 | 히든 스팟 필터를 클릭하면 히든 스팟만 표시된다 | `search-and-filter.feature` Scenario 5 | covered |
| AC6 | 도시 탭을 전환하면 해당 도시의 장소가 표시된다 | — | not covered |
| AC7 | 가격 필터 (무료/유료)로 장소를 필터링할 수 있다 | — | not covered |
| AC8 | 검색 입력 중 로딩 인디케이터가 표시된다 (디바운스 delay) | — | not covered |
| AC9 | 검색 필터와 카테고리 필터를 동시에 적용할 수 있다 | — | not covered |
| AC10 | 장소 카드에 장소 이름과 카테고리가 표시된다 | — | not covered |
| AC11 | 장소 카드에 평점(rating)이 표시된다 | — | not covered |
| AC12 | 장소 카드 클릭 시 해당 장소 상세 페이지로 이동한다 | — | not covered |

---

## TC 목록

| TC ID | Scenario | 파일 위치 |
|-------|----------|-----------|
| WHATODO-02-TC1 | Search for a place by name | `cypress/e2e/explore/search/search-and-filter.feature:10` |
| WHATODO-02-TC2 | Search returns no results for unknown place | `cypress/e2e/explore/search/search-and-filter.feature:14` |
| WHATODO-02-TC3 | Clear search input | `cypress/e2e/explore/search/search-and-filter.feature:18` |
| WHATODO-02-TC4 | Filter by category | `cypress/e2e/explore/search/search-and-filter.feature:23` |
| WHATODO-02-TC5 | Filter hidden spots only | `cypress/e2e/explore/search/search-and-filter.feature:27` |

---

## Notes

- AC6 (도시 탭 전환): explore 페이지에 도시 탭 존재하나 TC 미작성
- AC7 (가격 필터): selector는 `exploreSelectors.priceFilter`로 이미 정의됨 → TC 작성 가능
