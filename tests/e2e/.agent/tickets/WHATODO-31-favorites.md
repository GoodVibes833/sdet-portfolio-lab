# WHATODO-31 — Place: Favorites (찜하기)

**Module**: place  
**Feature**: Favorites / Wishlist  
**Feature File**: `cypress/e2e/place/favorites/favorites.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 장소 상세 페이지에 찜하기 버튼이 표시된다 | — | not covered |
| AC2 | 찜하기 버튼을 클릭하면 해당 장소가 찜 목록에 추가된다 | — | not covered |
| AC3 | 이미 찜한 장소의 버튼 아이콘이 활성화(filled) 상태로 표시된다 | — | not covered |
| AC4 | 찜 상태의 버튼을 다시 클릭하면 찜이 해제된다 | — | not covered |
| AC5 | 찜 상태는 페이지 새로고침 후에도 유지된다 (localStorage 기반) | — | not covered |
| AC6 | Explore 페이지 카드에서도 찜하기 상태가 시각적으로 표시된다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- localStorage `favorites` 키에 place ID 배열로 저장
- 로그인 불필요 (localStorage 기반)
