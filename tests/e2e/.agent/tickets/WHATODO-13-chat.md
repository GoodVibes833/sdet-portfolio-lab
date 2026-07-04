# WHATODO-13 — Chat: 1:1 Realtime Chat Page

**Module**: chat  
**Feature**: 1:1 Realtime Chat  
**Feature File**: `cypress/e2e/chat/chat.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | `/friends/chat/[userId]` 페이지가 정상 렌더링된다 | — | not covered |
| AC2 | 채팅 입력창이 표시된다 | — | not covered |
| AC3 | Enter 키로 메시지를 전송할 수 있다 | — | not covered |
| AC4 | 날짜 구분선이 메시지 목록에 표시된다 | — | not covered |
| AC5 | 읽음 표시(read receipt)가 메시지에 표시된다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- Supabase Realtime 의존 → 실제 메시지 전송 TC는 테스트 계정 2개 필요
- AC1, AC2는 URL 직접 접근으로 UI 구조 검증 가능
- AC3~AC5는 Supabase 연동 환경 필요
