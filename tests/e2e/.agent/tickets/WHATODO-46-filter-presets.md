# WHATODO-46 — Filter Presets: 저장된 필터 세트

**Module**: explore  
**Feature**: Filter Preset Save & Load  
**Feature File**: `cypress/e2e/explore/filter-presets/filter-presets.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | 현재 필터 상태를 프리셋으로 저장할 수 있다 | — | not covered |
| AC2 | 저장된 프리셋 목록이 표시된다 | — | not covered |
| AC3 | 프리셋을 클릭하면 해당 필터가 적용된다 | — | not covered |
| AC4 | 프리셋은 localStorage에 저장되어 새로고침 후에도 유지된다 | — | not covered |
| AC5 | 프리셋을 삭제할 수 있다 | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- localStorage `filterPresets` 키에 `{name, filters}[]` 형식으로 저장
