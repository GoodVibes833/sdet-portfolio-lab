# QA Status Report — 캐나다가자 (whatodo)

**작성일**: 2026-05-17  
**작성자**: QA / SDET  
**버전**: v1.0  
**대상**: Product Owner, Engineering Lead, Stakeholders

---

## Executive Summary

캐나다가자 앱의 E2E 테스트 체계 구축 현황을 보고한다.  
현재 **50개 티켓 / 200개 Acceptance Criteria**를 정의했으며,  
그 중 **19개 AC (9.5%)** 에 대해 Cypress E2E TC가 작성·커버된 상태다.  
이는 테스트 자동화 초기 단계로, 핵심 사용자 플로우 위주로 커버리지를 확대 중이다.

---

## 1. 테스트 대상 앱 개요

| 항목 | 내용 |
|------|------|
| **앱명** | 캐나다가자 (whatodo) |
| **플랫폼** | 웹 (Next.js 16 + TypeScript) |
| **배포** | Vercel |
| **DB / Auth** | Supabase (Google OAuth) |
| **지도** | Leaflet.js + OpenStreetMap |
| **지원 도시** | 토론토, 밴쿠버, 캘거리, 몬트리올, 오타와, 빅토리아, 에드먼턴, 위니펙 (총 122개 장소) |

---

## 2. 테스트 자동화 스택

| 구성 요소 | 도구 |
|----------|------|
| **E2E 테스트** | Cypress + Gherkin (BDD) |
| **Step 정의** | TypeScript (`@badeball/cypress-cucumber-preprocessor`) |
| **단위/통합 테스트** | Vitest + React Testing Library (42/42 통과 ✅) |
| **Selector 전략** | `data-testid` 기반 (CSS 클래스/구조 변경에 강함) |
| **AI 에이전트 지원** | `.agent/` 폴더 내 AGENT-DESIGN, product-context, skills 파일로 에이전트 워크플로우 자동화 지원 |

---

## 3. AC / TC 커버리지 현황

### 3-1. 전체 요약

| 지표 | 수치 |
|------|------|
| 정의된 티켓 수 | 50개 |
| 정의된 AC 수 | 200개 |
| TC 커버된 AC | 19개 |
| **AC Coverage** | **9.5%** |
| 작성된 TC 수 | 19개 |
| Vitest 단위/통합 테스트 | 42/42 ✅ |

### 3-2. 모듈별 커버리지

| 모듈 | 정의된 AC | 커버된 AC | Coverage | 비고 |
|------|-----------|-----------|----------|------|
| **auth** | 7 | 4 | 57% | 로그인 모달 커버, OAuth 플로우 미커버 |
| **explore** | 12 | 5 | 42% | 검색/필터 핵심 커버 |
| **map** | 23 | 9 | 39% | 도시탭/카테고리 필터 커버 |
| **place** | 17 | 6 | 35% | 상세 조회 핵심 커버 |
| **navbar** | 6 | 0 | 0% | TC 미작성 |
| **ranking** | 10 | 0 | 0% | TC 미작성 (로그인 불필요, 즉시 가능) |
| **hidden** | 6 | 0 | 0% | TC 미작성 (로그인 불필요, 즉시 가능) |
| **friends / chat** | 15 | 0 | 0% | Supabase 연동 필요 |
| **localStorage 기능** | 38 | 0 | 0% | favorites, visited, review, memo, tags, collections |
| **gamification** | 16 | 0 | 0% | 포인트/레벨/뱃지/룰렛 |
| **기타** | 50 | 0 | 0% | tips, community, missions, onboarding, settings, PWA 등 |

### 3-3. 커버리지 시각화

```
auth      ████████░░░░░░░░░░░░  57%
explore   ████████░░░░░░░░░░░░  42%  (5/12)
map       ████████░░░░░░░░░░░░  39%  (9/23)
place     ███████░░░░░░░░░░░░░  35%  (6/17)
navbar    ░░░░░░░░░░░░░░░░░░░░   0%
ranking   ░░░░░░░░░░░░░░░░░░░░   0%
hidden    ░░░░░░░░░░░░░░░░░░░░   0%
friends   ░░░░░░░░░░░░░░░░░░░░   0%
기타      ░░░░░░░░░░░░░░░░░░░░   0%
─────────────────────────────────────
전체      ██░░░░░░░░░░░░░░░░░░  9.5% (19/200)
```

---

## 4. 기존 TC 실행 결과

> ⚠️ 현재 모든 TC가 **미실행** 상태 (테스트 환경 미구성).  
> 아래는 TC 설계 기준 예상 결과다.

| TC ID | 시나리오 | 예상 결과 |
|-------|----------|----------|
| WHATODO-01-TC1 | Login modal opens | 실행 가능 |
| WHATODO-01-TC2 | Modal closes via X | 실행 가능 |
| WHATODO-01-TC3 | Modal closes via outside click | 실행 가능 |
| WHATODO-02-TC1~5 | Search & Filter (5 scenarios) | 실행 가능 |
| WHATODO-03-TC1~3 | City Tab Navigation | 실행 가능 |
| WHATODO-04-TC1~4 | Place Filter by Category | 실행 가능 |
| WHATODO-05-TC1~4 | Place Detail Page | 실행 가능 |

**TC 실행 전 필요 조건**:
```
□ 로컬: npm run dev (port 3001) 실행 중
□ .env.local 설정 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
□ cypress.config.ts의 baseUrl: http://localhost:3001 확인
```

---

## 5. 리스크 및 블로커

| 리스크 | 영향 범위 | 심각도 | 해결 방안 |
|--------|-----------|--------|----------|
| **Google OAuth E2E 불가** | WHATODO-24, 05-AC9/AC10, 14 | 🔴 높음 | Supabase session을 localStorage에 직접 주입하는 `cy.session()` 커스텀 커맨드 구현 |
| **Supabase 미연결 환경** | WHATODO-11~13, 26 | 🔴 높음 | 로컬 `.env.local` 설정 + Supabase mock 검토 |
| **Leaflet 지도 로딩 지연** | WHATODO-03, 04, 07, 22, 23 | 🟠 중간 | `waitForMapToLoad()` 커스텀 커맨드 이미 구현됨 |
| **localStorage 테스트 간 오염** | WHATODO-31~46 | 🟠 중간 | 각 TC `beforeEach`에 `cy.clearLocalStorage()` 추가 |
| **데이터 의존 검증** | 여러 TC | 🟡 낮음 | 정확한 숫자 대신 `have.length.greaterThan(0)` 패턴 사용 |

---

## 6. 다음 Sprint 권장 우선순위

### 즉시 실행 가능 (로그인 불필요, selector 추가만 필요)

| 우선순위 | 티켓 | AC 수 | 예상 소요 |
|----------|------|-------|----------|
| 🔴 P1 | WHATODO-30 (전체 페이지 Smoke) | 10 | 0.5일 |
| 🔴 P1 | WHATODO-06 (Navbar) | 6 | 0.5일 |
| 🟠 P2 | WHATODO-09 + WHATODO-25 (Ranking) | 10 | 1일 |
| 🟠 P2 | WHATODO-08 (Hidden Spots) | 6 | 0.5일 |
| 🟠 P2 | WHATODO-15, 16, 17 (Tips/Community/Missions) | 8 | 0.5일 |

### 중기 (selector 신규 작성 필요)

| 우선순위 | 티켓 | AC 수 | 블로커 |
|----------|------|-------|--------|
| 🟡 P3 | WHATODO-31~35 (favorites, visited, review, memo, tags) | 29 | place.selectors.ts 확장 |
| 🟡 P3 | WHATODO-36~39 (collections, gamification) | 23 | 신규 selector 파일 |
| 🟡 P3 | WHATODO-19, 20, 27 (Explore 추가 기능) | 12 | selector 이미 일부 있음 |

### 장기 (인프라/Supabase 필요)

| 우선순위 | 티켓 | 블로커 |
|----------|------|--------|
| 🔵 P4 | WHATODO-11~14, 24, 26 (Social 기능) | OAuth 우회 + Supabase 테스트 계정 |
| 🔵 P4 | WHATODO-13 (Chat) | Supabase Realtime + 테스트 계정 2개 |

---

## 7. 테스트 자동화 성숙도 로드맵

```
현재 (Phase 1)          Phase 2               Phase 3
────────────────────────────────────────────────────────
AC 정의 완료 ✅          Smoke TC 완성          소셜 기능 TC
19/200 TC 커버           목표: 60/200 (30%)     목표: 120/200 (60%)
에이전트 설계 완료 ✅    localStorage TC        CI 파이프라인 연동
skills 파일 완성 ✅      반응형 TC              결과 자동 리포트
                         에러 핸들링 TC
```

---

## 8. 단위/통합 테스트 현황 (Vitest)

| 테스트 파일 | 테스트 수 | 결과 |
|-------------|-----------|------|
| `src/test/data.test.ts` | 16 | ✅ Pass |
| `src/test/filter.test.ts` | 13 | ✅ Pass |
| `src/test/PlaceCard.test.tsx` | 13 | ✅ Pass |
| **합계** | **42** | **✅ 42/42 Pass** |

> 단위/통합 테스트는 현재 100% 통과 상태.  
> E2E 테스트 미실행이 단위 테스트 커버리지와 별개임에 주의.

---

## 9. 용어 정의

| 용어 | 설명 |
|------|------|
| **AC** | Acceptance Criteria — 기능이 "완료"로 인정되는 조건 |
| **TC** | Test Case — AC를 검증하는 Gherkin 시나리오 |
| **Covered** | 해당 AC를 검증하는 TC가 작성된 상태 |
| **Smoke** | 핵심 기능만 빠르게 검증하는 최소 TC 세트 |
| **Regression** | 전체 기능 회귀 검증 TC 세트 |
| **BDD** | Behavior-Driven Development — Given/When/Then 형식의 테스트 작성 방식 |

---

*다음 업데이트 예정: TC 실행 완료 후 Pass/Fail Rate 추가*
