# WHY THIS STRUCTURE — 왜 이렇게 만들었는가

> 이 문서는 살아있는 문서다.  
> 워크플로우가 바뀌면 이 파일도 업데이트한다.  
> 마지막 수정: 2026-05-17 (Phase 1 완성)

---

## 1. 핵심 개념: AI 에이전트의 한계를 이해해야 구조가 보인다

### Context Window
LLM은 한 번에 볼 수 있는 텍스트 양이 제한되어 있다.  
파일을 많이 열수록, 파일이 길수록 → **집중력이 분산되고 실수가 늘어난다.**

```
❌ 나쁜 패턴: "50개 티켓 파일 전부 읽고 TC 써줘"
✅ 좋은 패턴: "WHATODO-06 파일만 읽고, 이 티켓만 처리해줘"
```

### Grounding (근거 기반 행동)
에이전트가 추측으로 행동하면 반드시 실수가 난다.  
**파일 구조, selector, step이 명확히 적혀 있어야** 에이전트가 추측 없이 작업한다.

```
❌ "버튼 selector는 .login-btn 이겠지"  → 깨짐
✅ "auth.selectors.ts에 loginNavBtn이 정의되어 있음" → 안전
```

### Memory
LLM은 대화가 끝나면 이전 대화를 기억하지 못한다.  
그래서 **파일이 메모리 역할**을 해야 한다.  
`product-context.md`, `tickets/`, `skill-*.md`가 모두 에이전트의 외부 메모리다.

---

## 2. 이 프로젝트 구조를 이렇게 만든 이유

### 2-1. 티켓별 파일 (tickets/WHATODO-XX.md)

**선택한 이유:**
- 에이전트가 한 티켓 작업 시 **파일 1개만** 열면 AC + TC + 실행결과를 전부 볼 수 있다
- AC와 TC가 같은 파일에 있어서 **동기화 실수**가 없다
- 50개 티켓이 있어도 **필요한 것만** 열면 된다 → context 낭비 없음

**대안 (분리형)과 비교:**
```
분리형: ac-list.md + ac-tc-mapping.md
→ 매 작업마다 2개 파일을 크로스 참조해야 함
→ 파일이 클수록 context window 낭비
→ 두 파일 간 불일치 발생 가능
```

**결론: 티켓 = 파일 1개. 작업 단위와 파일 단위가 일치해야 한다.**

---

### 2-2. 파일 역할 3레이어 구조

```
레이어 1: 작업 단위 파일 (에이전트가 자주 열고 쓰는 것)
  tickets/WHATODO-XX.md

레이어 2: 집계/참조 파일 (마무리 때만 업데이트)
  test-plan-status.md

레이어 3: 사람 전용 파일 (에이전트가 건드리지 않음)
  QA-STATUS-REPORT.md
```

**왜 이렇게 나눴는가:**
- 에이전트가 업데이트해야 할 파일을 최소화 → 실수 범위 최소화
- QA-STATUS-REPORT는 stakeholder에게 보여주는 문서 → 사람이 맥락을 가미해서 작성해야 함
- test-plan-status는 숫자만 바꾸면 되는 기계적 작업 → 에이전트 가능

---

### 2-3. Skill 파일 분리 (skills/)

**왜 하나의 큰 가이드 파일 대신 분리했는가:**

```
❌ 하나의 큰 파일: "에이전트 사용 설명서 1000줄"
   → 에이전트가 전체를 읽어야 함 → context 낭비
   
✅ 분리된 skill 파일: 필요할 때 필요한 것만 읽음
   skill-write-tc.md     ← TC 쓸 때만
   skill-find-step.md    ← step 찾을 때만
   skill-request-selector.md  ← selector 없을 때만
```

**원칙: 에이전트가 "지금 뭐가 필요한가"에 따라 파일을 선택적으로 읽어야 한다.**

---

### 2-4. Selector를 별도 파일로 관리

**왜 step 파일 안에 selector를 넣지 않았는가:**

```
선택 1 (혼합): step 파일 안에 직접 cy.get('[data-testid="xxx"]') 작성
→ selector 변경 시 step 파일 전체를 고쳐야 함
→ 여러 step에서 같은 element를 각자 다르게 쓸 수 있음

선택 2 (분리): selectors 파일에 한 번만 정의, step에서 import
→ data-testid가 바뀌면 selector 파일 1곳만 수정
→ 에이전트가 selector 파일을 참조하므로 추측 없음
```

**이것은 Page Object Model(POM) 패턴의 변형이다.**  
전통적 POM: 페이지별로 클래스 파일  
이 프로젝트: 모듈별로 selectors.ts 파일 → **더 가볍고 TypeScript 친화적**

---

### 2-5. QA-STATUS-REPORT를 에이전트에서 분리한 이유

```
에이전트가 잘 하는 것:  숫자 계산, 형식에 맞는 내용 채우기
에이전트가 못 하는 것:  "이번 스프린트에서 어떤 리스크가 중요한가"
                        "stakeholder가 뭘 알고 싶어 하는가"
                        맥락이 필요한 서술
```

QA-STATUS-REPORT는 단순 숫자가 아닌 **판단과 서술**이 들어간다.  
에이전트가 이걸 자동으로 업데이트하면 → 틀린 숫자 or 맥락 없는 서술 → 신뢰도 하락.

**규칙: 에이전트는 사실(숫자, 상태)만 관리. 판단이 필요한 문서는 사람이 관리.**

---

## 3. 워크플로우 전체 그림 (현재 버전)

```
[Jira 티켓 INPUT]
        ↓
① product-context.md 읽기 → 모듈 파악
        ↓
② tickets/WHATODO-XX.md 열기
   → AC 있는가?  없으면 → AC 작성
   → TC 있는가?  있으면 → 기존 TC에 태그 추가 후 ⑥으로
   없으면 → 아래로
        ↓
③ feature 파일 스캔
   → 커버되는 시나리오 있는가?
     있으면 → step 텍스트 일치 확인 후 태그 추가
     없으면 → 새 TC 작성 (feature 파일에 Scenario 추가)
        ↓
④ step 텍스트 매칭 확인 (skill-find-step.md 참조)
   → feature 텍스트 == step 파일 텍스트?  불일치 → step 파일 수정
   → step 없으면: 새 step 작성
       selector 있는가? (selectors/*.ts 확인)
       없으면 → 사람한테 요청 (skill-request-selector.md)
        ↓
⑤ TC 실행 (사람이 직접: npm run cy:run --spec [파일])
   실패 시 → 에러 로그 전달 → 코드 수정 반복
        ↓
⑥ 문서 업데이트 (skill-update-docs.md)
   → tickets/WHATODO-XX.md: covered 상태, TC 목록, Last Run, Result
   → test-plan-status.md: 수치만 갱신
   ❌ QA-STATUS-REPORT.md: 건드리지 않음
```

### 3-1. 실증 사례 — WHATODO-06 (2026-05-17)

```
[INPUT] WHATODO-06 navbar, AC1·AC2 (Explore 링크 이동 / 로그인 버튼 표시)

① product-context: navbar 모듈 = / 경로, navbarSelectors 파일 있음
② tickets/WHATODO-06.md: AC6·AC2가 해당 AC와 일치 확인
③ navbar.feature: 6개 Scenario 이미 존재 → 신규 작성 불필요
④ step 텍스트 불일치 9곳 발견
   예: feature "I click the explore link in the navbar"
       step   "I click the Explore nav link"  ← 불일치
   → navbar.steps.ts 전체 텍스트 feature 기준으로 정렬
⑤ TC 실행 대기 (앱 미실행 상태)
⑥ 문서 업데이트 완료
   - WHATODO-06.md: AC1~6 covered, TC1~6 추가
   - test-plan-status: 22% → 28%, TC 19 → 25
```

**핵심 교훈**: feature 파일이 먼저 만들어지면 step 파일은 반드시 feature 텍스트 기준으로 맞춰야 한다.

---

## 4. 다른 프로젝트와의 구조 비교

### 4-0. 일반적인 Cypress 자동화 구조 vs 이 프로젝트

| 항목 | 일반 Cypress 프로젝트 | 이 프로젝트 |
|------|---------------------|------------|
| TC 관리 | 파일명/태그로만 구분 | 티켓별 AC+TC 파일로 추적 |
| Selector 관리 | step 파일 안에 직접 | selectors/ 별도 파일로 분리 |
| 에이전트 지침 | 없음 (사람이 알아서) | AGENT-DESIGN + skill 파일로 명시 |
| 커버리지 추적 | 없거나 외부 도구 | test-plan-status.md로 자체 관리 |
| 문서 업데이트 | 수동/사후 | 에이전트가 작업마다 갱신 |
| 실수 방지 | code review | 금지사항 명시 + 파일 역할 분리 |

**핵심 차별점**: 일반 구조는 "테스트 코드"만 있고, 이 구조는 **에이전트가 스스로 판단하고 문서화까지 하는 workflow**가 파일로 정의되어 있다.

---

## 5. 다른 프로젝트에 적용할 때 고려할 것

### 5-1. 반드시 먼저 만들어야 하는 것

```
product-context.md     ← 모듈 구조, URL, 핵심 flow, 주요 제약
AGENT-DESIGN.md        ← 워크플로우 + 파일 탐색 순서 + 금지사항
```

이 두 파일이 없으면 에이전트가 매번 처음부터 추론해야 함 → 실수 증가.

### 5-2. 티켓 규모에 따른 구조 조정

| 규모 | 추천 구조 |
|------|----------|
| 티켓 10개 이하 | 하나의 파일에 모든 AC + TC 관리 가능 |
| 티켓 10~50개 | 이 프로젝트 구조 (티켓별 파일 분리) 적합 |
| 티켓 50개 초과 | 모듈별 하위 폴더 추가 고려 (`tickets/map/`, `tickets/auth/`) |

### 5-3. 기술 스택이 달라도 변하지 않는 것

```
변하지 않는 원칙:
✅ 에이전트가 한 번에 여는 파일 = 최소화
✅ 작업 단위 = 파일 단위
✅ selector/locator는 별도 파일로 분리
✅ 에이전트 업데이트 대상 파일과 사람 전용 파일을 명확히 나눔
✅ skill 파일은 "지금 필요한 것만" 읽을 수 있게 분리

기술 스택에 따라 바뀌는 것:
- Gherkin → Playwright, Jest, etc.로 교체 가능
- data-testid → aria-label, role, text 등으로 selector 전략 변경
- Supabase 제약 → Firebase, REST API mock 등으로 대체
```

### 5-4. OAuth/외부 서비스가 있는 프로젝트

이 프로젝트에서 배운 교훈:
- **실제 로그인 플로우는 E2E에서 테스트하지 않는다**
- 대신 `cy.session()` + localStorage 직접 주입으로 로그인 상태 시뮬레이션
- 이 패턴은 Firebase Auth, AWS Cognito 등에도 동일하게 적용됨

---

## 6. 이 구조의 한계와 개선 방향

### 현재 한계

```
1. test-plan-status.md가 커지면 에이전트가 수정할 때 실수 가능
   → 현재 대응: 티켓 인덱스 수치만 에이전트가 수정, 세부 섹션은 tickets/ 파일이 담당

2. tc-index.md와 tickets/ 파일이 중복 정보를 가짐
   → 현재 대응: tc-index는 읽기 전용 조감도, 에이전트 수정 금지

3. feature 텍스트와 step 텍스트 불일치 가능성
   → 실증 사례: WHATODO-06 작업 시 navbar.feature 9곳 불일치 발견 → step 파일 수정
   → 예방책: step 파일 생성 시 feature 파일을 먼저 읽고 텍스트 맞춰서 작성
```

### 개선 로드맵

```
Phase 1 (완료 ✅):
  ✅ 문서 구조 완성 (AGENT-DESIGN, product-context, skill 파일 5개)
  ✅ 티켓 50개 + AC 200개
  ✅ feature 파일 50개 (Gherkin)
  ✅ selector 파일 24개
  ✅ step 파일 24개
  ✅ WHY-THIS-STRUCTURE.md (구조 설계 이유 문서)
  ✅ npm install 완료

Phase 2 (진행 중):
  ✅ WHATODO-06 전체 플로우 실증 (티켓 INPUT → 문서 업데이트)
  ⬜ 앱 PORT=3001 실행 후 smoke TC 실행 (WHATODO-30 먼저)
  ⬜ TC 실행 결과 tickets/ 파일 + test-plan-status에 반영
  ⬜ step 텍스트 불일치 전체 점검 (feature ↔ steps)

Phase 3 (장기):
  ⬜ cy.session()으로 로그인 상태 시뮬레이션
  ⬜ CI 파이프라인 연동
  ⬜ 결과 자동 리포트
```

---

## 7. 이 파일을 업데이트하는 시점

```
✅ 워크플로우가 변경될 때
✅ 새로운 제약이 발견될 때 (예: Supabase 미연결, OAuth 제약 등)
✅ 구조를 개선했을 때
✅ Phase가 넘어갈 때
❌ 매 티켓 작업마다 업데이트하지 않음 (그건 tickets/ 파일이 담당)
```
