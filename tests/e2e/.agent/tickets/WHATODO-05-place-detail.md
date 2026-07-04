# WHATODO-05 — Place: Place Detail Page

**Module**: place  
**Feature**: Place Detail Page  
**Feature File**: `cypress/e2e/place/place-detail/view-place-detail.feature`

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 장소 카드를 클릭하면 `/place/[id]` 상세 페이지로 이동한다 | `view-place-detail.feature` Scenario 1 | covered |
| AC2 | 장소 상세 페이지에 장소 이름이 표시된다 | `view-place-detail.feature` Scenario 1 | covered |
| AC3 | 장소 상세 페이지에 카테고리가 표시된다 | `view-place-detail.feature` Scenario 1 | covered |
| AC4 | 장소 상세 페이지에 평점(rating)이 표시된다 | `view-place-detail.feature` Scenario 2 | covered |
| AC5 | 히든 스팟인 경우 히든 스팟 배지가 표시된다 | `view-place-detail.feature` Scenario 3 | covered |
| AC6 | 공식 웹사이트가 있는 장소는 클릭 가능한 외부 링크가 표시된다 | `view-place-detail.feature` Scenario 4 | covered |
| AC7 | 장소 상세 페이지에 주소(address)가 표시된다 | — | not covered |
| AC8 | 장소 상세 페이지에 bestSeason 정보가 표시된다 | — | not covered |
| AC9 | 로그인한 사용자는 방문 표시(mark visited) 버튼을 볼 수 있다 | — | not covered |
| AC10 | 로그인한 사용자는 친구 초대(invite) 버튼을 볼 수 있다 | — | not covered |
| AC11 | 장소 상세 페이지에 장소 이미지가 표시된다 | — | not covered |
| AC12 | 장소 상세 페이지에 장소 설명(description)이 표시된다 | — | not covered |
| AC13 | 뒤로가기 버튼 또는 브라우저 Back으로 이전 페이지로 돌아갈 수 있다 | — | not covered |

---

## TC 목록

| TC ID | Scenario | 파일 위치 |
|-------|----------|-----------|
| WHATODO-05-TC1 | Navigate to place detail page | `cypress/e2e/place/place-detail/view-place-detail.feature:10` |
| WHATODO-05-TC2 | Place detail shows rating | `cypress/e2e/place/place-detail/view-place-detail.feature:16` |
| WHATODO-05-TC3 | Hidden spot badge is shown for hidden spots | `cypress/e2e/place/place-detail/view-place-detail.feature:20` |
| WHATODO-05-TC4 | Official website link is clickable | `cypress/e2e/place/place-detail/view-place-detail.feature:24` |

---

## Notes

- AC7 (address): `placeSelectors.placeAddress`로 selector 이미 정의됨 → TC 추가 가능
- AC8 (bestSeason): `placeSelectors.bestSeasonBadge`로 selector 이미 정의됨 → TC 추가 가능
- AC9, AC10 (로그인 기능): OAuth 우회 방법 확보 전까지 not covered 유지
