# WHATODO-43 — PWA: Progressive Web App

**Module**: pwa  
**Feature**: PWA Install & Manifest  
**Feature File**: `cypress/e2e/pwa/pwa.feature` (미작성)

---

## Acceptance Criteria

| AC | 내용 | TC 커버 | 상태 |
|----|------|---------|------|
| AC1 | manifest.json이 올바르게 로드된다 | — | not covered |
| AC2 | 앱 이름이 manifest에 정의되어 있다 | — | not covered |
| AC3 | PWA 아이콘이 manifest에 정의되어 있다 | — | not covered |
| AC4 | Service Worker가 등록된다 | — | not covered |
| AC5 | 페이지 로드 속도가 허용 범위 내다 (LCP 기준) | — | not covered |

---

## TC 목록

없음 (신규 작성 필요)

---

## Notes

- `cy.request('/manifest.json')` 으로 manifest 검증 가능
- Service Worker는 `cy.window().its('navigator.serviceWorker')` 로 확인
- LCP 성능 지표는 Lighthouse CI 연동 시 자동 측정
