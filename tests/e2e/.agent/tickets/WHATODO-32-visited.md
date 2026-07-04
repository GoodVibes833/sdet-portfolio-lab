# WHATODO-32 — Place: Mark Visited (방문 표시)

**Module**: place  
**Feature**: Mark as Visited  
**Feature File**: `cypress/e2e/place/visited/mark-visited.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 장소 상세 페이지에 "방문 표시" 버튼이 표시된다 | — | not covered |
| AC2 | 방문 표시 버튼을 클릭하면 해당 장소가 방문 목록에 추가된다 | — | not covered |
| AC3 | 이미 방문한 장소의 버튼이 활성화 상태로 표시된다 | — | not covered |
| AC4 | 방문 표시 상태는 페이지 새로고침 후에도 유지된다 (localStorage) | — | not covered |
| AC5 | 방문 표시 시 타임스탬프가 함께 저장된다 | — | not covered |
| AC6 | 방문한 장소를 다시 클릭하면 방문 표시가 해제된다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- localStorage `visited` 키에 `{id, ts}[]` 형식으로 저장
- `placeSelectors.visitBtn` selector 이미 정의됨
- 로그인 불필요 (localStorage 기반)
