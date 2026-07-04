# WHATODO-33 — Place: Review (리뷰 작성)

**Module**: place  
**Feature**: Review Form  
**Feature File**: `cypress/e2e/place/review/review.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 장소 상세 페이지에 리뷰 작성 영역이 표시된다 | — | not covered |
| AC2 | 리뷰 텍스트를 입력하고 저장할 수 있다 | — | not covered |
| AC3 | 저장된 리뷰가 페이지에 표시된다 | — | not covered |
| AC4 | 리뷰는 페이지 새로고침 후에도 유지된다 (localStorage) | — | not covered |
| AC5 | 리뷰를 수정할 수 있다 | — | not covered |
| AC6 | 리뷰를 삭제할 수 있다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- localStorage `reviews` 키에 `{[id]: string}` 형식으로 저장
- 로그인 불필요 (localStorage 기반)
