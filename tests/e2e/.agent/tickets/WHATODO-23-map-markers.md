# WHATODO-23 — Map: Place Markers & Cluster

**Module**: map  
**Feature**: Place Markers on Map  
**Feature File**: `cypress/e2e/map/markers/map-markers.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 지도에 장소 마커가 1개 이상 표시된다 | — | not covered |
| AC2 | 마커를 클릭하면 해당 장소 정보가 표시된다 | — | not covered |
| AC3 | 줌 아웃 시 마커 클러스터가 표시된다 | — | not covered |
| AC4 | 클러스터를 클릭하면 줌 인 되며 개별 마커로 분리된다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- `mapSelectors.mapMarker`, `mapSelectors.markerCluster` selector 이미 정의됨
- 마커 클릭 인터랙션은 `.leaflet-marker-icon`에 `.click()` 사용
- 클러스터 동작은 줌 레벨 의존적 → Leaflet 줌 제어 필요
