# WHATODO-35 — Place: Tags (태그)

**Module**: place  
**Feature**: Tag Management  
**Feature File**: `cypress/e2e/place/tags/tags.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 장소 상세 페이지에 태그 입력 영역이 표시된다 | — | not covered |
| AC2 | 태그를 추가할 수 있다 | — | not covered |
| AC3 | 추가된 태그가 표시된다 | — | not covered |
| AC4 | 태그는 페이지 새로고침 후에도 유지된다 (localStorage) | — | not covered |
| AC5 | 태그를 삭제할 수 있다 | — | not covered |
| AC6 | 여러 개의 태그를 추가할 수 있다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- localStorage `tags` 키에 `{[id]: string[]}` 형식으로 저장
- 로그인 불필요 (localStorage 기반)
