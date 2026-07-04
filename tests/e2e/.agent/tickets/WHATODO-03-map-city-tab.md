# WHATODO-03 — Map: City Tab Navigation

**Module**: map  
**Feature**: City Tab Navigation  
**Feature File**: `cypress/e2e/map/city-tab/switch-city.feature`

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 메인 지도 페이지 진입 시 기본 도시가 Toronto로 설정된다 | `switch-city.feature` Scenario 1 | covered |
| AC2 | 기본 Toronto 탭이 active 상태로 표시된다 | `switch-city.feature` Scenario 1 | covered |
| AC3 | 도시 탭 클릭 시 해당 탭이 active 상태로 변경된다 | `switch-city.feature` Scenario 2, 3 | covered |
| AC4 | 다른 도시 탭으로 전환하면 해당 도시의 마커가 지도에 표시된다 | `switch-city.feature` Scenario 2 | covered |
| AC5 | 여러 도시를 순차 전환 시 마지막 선택 도시 탭이 active 상태다 | `switch-city.feature` Scenario 3 | covered |
| AC6 | 지도가 선택한 도시의 좌표로 이동(센터링)된다 | — | not covered |

---

## TC 목록

| TC ID | Scenario | 파일 위치 |
|-------|----------|-----------|
| WHATODO-03-TC1 | Default city is Toronto | `cypress/e2e/map/city-tab/switch-city.feature:10` |
| WHATODO-03-TC2 | Switch to Vancouver | `cypress/e2e/map/city-tab/switch-city.feature:14` |
| WHATODO-03-TC3 | Switch between multiple cities | `cypress/e2e/map/city-tab/switch-city.feature:19` |

---

## Notes

- AC6 (지도 센터링): Leaflet 지도 viewport 좌표 직접 검증은 복잡 → 현재 `mapContainer.should('be.visible')` 수준으로 간접 검증
- `waitForMapToLoad()` 커스텀 커맨드가 지도 렌더링 완료를 기다림
