# WHATODO-37 — Gamification: Points & Level

**Module**: gamification  
**Feature**: Points and Level System  
**Feature File**: `cypress/e2e/gamification/points-level.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 사용자의 현재 포인트가 어딘가에 표시된다 | — | not covered |
| AC2 | 사용자의 현재 레벨이 표시된다 | — | not covered |
| AC3 | 방문 표시 시 포인트가 증가한다 | — | not covered |
| AC4 | 포인트가 특정 임계값에 달하면 레벨이 올라간다 | — | not covered |
| AC5 | 포인트/레벨은 localStorage에 저장되어 새로고침 후에도 유지된다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- localStorage `gamification` 키에 `{points, level, badges}` 형식으로 저장
- `useGamification` 훅이 포인트/레벨 로직 담당
