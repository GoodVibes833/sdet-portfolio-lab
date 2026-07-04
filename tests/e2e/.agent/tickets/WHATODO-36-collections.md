# WHATODO-36 — Collections: Collection Manager (컬렉션)

**Module**: collections  
**Feature**: Collection CRUD  
**Feature File**: `cypress/e2e/collections/collections.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 컬렉션을 새로 만들 수 있다 (이름 입력 + 생성) | — | not covered |
| AC2 | 생성된 컬렉션 목록이 표시된다 | — | not covered |
| AC3 | 장소를 컬렉션에 추가할 수 있다 | — | not covered |
| AC4 | 컬렉션에 포함된 장소 목록이 표시된다 | — | not covered |
| AC5 | 컬렉션에서 장소를 제거할 수 있다 | — | not covered |
| AC6 | 컬렉션을 삭제할 수 있다 | — | not covered |
| AC7 | 컬렉션은 페이지 새로고침 후에도 유지된다 (localStorage) | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- localStorage `collections` 키에 `{id, name, ids}[]` 형식으로 저장
- 로그인 불필요 (localStorage 기반)
