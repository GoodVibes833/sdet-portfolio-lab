# AGENT-DESIGN — 캐나다가자 Cypress SDET 에이전트 설계

> 에이전트가 새 티켓을 받았을 때부터 문서 업데이트까지 **어떻게 행동해야 하는지** 정의.  
> 읽는 순서: 이 파일 → `product-context.md` → 해당 티켓 파일 → 작업 시작

---

## 0. 작업 시작 전 필수 확인

새 티켓(WHATODO-XX) 작업 전 반드시 아래 순서로 읽어라:

```
1. .agent/product-context.md          ← 모듈 구조, flow, 컨벤션 (짧음 — 매 작업 시작 시 읽기)
2. .agent/tickets/WHATODO-XX-*.md     ← 해당 티켓의 AC + TC 현황 (이 파일 1개로 충분)
```

> ⚠️ `test-plan-status.md`는 작업 시작 시 읽지 않는다.  
> 마무리 단계에서 수치 갱신할 때만 연다.

---

## 1. 워크플로우 전체 절차

```
[티켓 INPUT: WHATODO-XX]
        ↓
[1단계] AC 파일 확인
  .agent/tickets/WHATODO-XX-*.md 읽기
  → covered / not covered AC 목록 파악
        ↓
[2단계] 기존 TC 스캔
  cypress/e2e/[module]/ 하위 .feature 파일 탐색
  → 해당 AC를 커버하는 시나리오 있는지 확인
        ↓                        ↓
   [커버됨]                  [커버 안됨]
      ↓                           ↓
  feature 파일에             새 TC 작성
  @WHATODO-XX @ACN             (skill-write-tc.md 참고)
  태그 추가                       ↓
                           기존 step 재활용 가능?
                           (skill-find-step.md 참고)
                                  ↓              ↓
                             [재활용 가능]    [step 없음]
                                  ↓              ↓
                             step 재사용      새 step 작성
                                              selector 있는지 확인
                                              없으면 → 나한테 요청
                                              (skill-request-selector.md 참고)
        ↓                         ↓
        └─────────────────────────┘
                     ↓
[3단계] TC 실행
  나(사람)가 직접 실행
  실패 시 → 에러 + 내가 본 것 전달 → 코드 수정
        ↓
[4단계] 문서 업데이트 (skill-update-docs.md 참고)
  ① tickets/WHATODO-XX.md
      → AC covered 상태 변경
      → TC 목록 추가 / Last Run / Result 업데이트
  ② test-plan-status.md
      → 해당 티켓 섹션 coverage 수치 + 전체 요약 수치 갱신

  ❌ QA-STATUS-REPORT.md 는 에이전트가 건드리지 않는다
      → 사람이 스프린트 단위로 수동 갱신하는 파일
```

---

## 2. 파일 탐색 순서 규칙

### TC 스캔 순서

```
1. product-context.md에서 모듈명 확인
2. cypress/e2e/[module]/ 폴더 목록 확인
3. 해당 폴더의 .feature 파일 읽기
4. Scenario 제목과 Given/When/Then으로 AC 커버 여부 판단
```

**절대 하지 말 것**: 모든 feature 파일을 한꺼번에 읽기 → context 낭비

### Step 탐색 순서

```
1. cypress/step_definitions/[module]/[module].steps.ts 읽기
2. 키워드로 매칭 step 찾기 (Given/When/Then 텍스트)
3. 없으면 다른 모듈 step 파일도 확인
4. 그래도 없으면 → 새 step 작성
```

### Selector 탐색 순서

```
1. cypress/support/selectors/[module]/[module].selectors.ts 읽기
2. 필요한 selector 있는지 확인
3. 없으면 → 나한테 요청 (skill-request-selector.md 형식으로)
```

---

## 3. 에이전트 / 나(사람) 역할 분담 (콜라보 모드)

| 단계 | 에이전트 | 나 |
|------|---------|-----|
| TC 설계 | AC 기반 초안 작성 | 검토 + 방향 수정 |
| Step 작성 | 기존 재활용 or 새로 작성 | 승인 |
| Selector | 없으면 요청 | DOM 확인 후 제공 |
| TC 실행 | 실행 명령 준비 | **직접 실행** |
| 실패 분석 | 코드 레벨 분석 | UI/flow 레벨 분석 + 코멘트 |
| 문서 업데이트 | tickets/ 파일 + test-plan-status 수치 갱신 | 검토 |
| QA-STATUS-REPORT 갱신 | ❌ 건드리지 않음 | 스프린트 단위로 직접 갱신 |

> **핵심**: TC 실행과 실패의 UI 원인 판단은 반드시 내가 한다.  
> 에이전트는 코드/로그 레벨에서만 분석한다.

---

## 4. Agency 수준 정의

현재 목표: **Medium Agency**

```
Low Agency                Medium Agency (지금)          High Agency (미래)
─────────────────────────────────────────────────────────────
"이 파일 써줘"    →    기존 step 찾아서 재활용    →    티켓 받아서 알아서 다 해줘
                       실패 시 나한테 묻기
```

**원칙**: 판단이 필요하면 진행하기 전에 나한테 물어라.  
특히 아래 상황에서는 **반드시** 먼저 물어라:
- 새 모듈을 만들어야 할 것 같을 때
- selector를 추측으로 써야 할 것 같을 때
- AC의 의도가 불명확할 때

---

## 5. 금지 사항

```
❌ selector를 DOM 확인 없이 추측으로 쓰기
❌ 기존 step 파일을 확인하지 않고 새 step 작성
❌ 모든 feature 파일을 한꺼번에 읽기
❌ test-plan-status 업데이트를 건너뛰기
❌ AC와 무관한 TC 작성
❌ QA-STATUS-REPORT.md 자동 수정 (사람 전용 파일)
```

---

## 6. 파일 구조 참고

```
tests/e2e/
├── cypress/
│   ├── e2e/
│   │   └── [module]/[feature-name]/[scenario].feature
│   ├── step_definitions/
│   │   └── [module]/[module].steps.ts
│   └── support/
│       ├── selectors/[module]/[module].selectors.ts
│       ├── commands.ts        ← navigateTo(), waitForMapToLoad()
│       └── e2e.ts
└── .agent/
    ├── AGENT-DESIGN.md        ← 지금 이 파일 [에이전트 읽기]
    ├── WHY-THIS-STRUCTURE.md  ← 구조 설계 이유 + 개발 로드맵 [사람 참조용]
    ├── product-context.md     ← 모듈/flow/컨벤션 [에이전트 읽기]
    ├── tickets/               ← 티켓별 AC+TC 파일 [에이전트 읽기+쓰기]
    ├── test-plan-status.md    ← coverage 수치 집계 [에이전트 마무리 시만 쓰기]
    ├── tc-index.md            ← 전체 AC-TC 조감 [사람 참조용, 에이전트 필요 시]
    ├── QA-STATUS-REPORT.md    ← stakeholder 리포트 [사람 전용 — 에이전트 수정 금지]
    └── skills/
        ├── skill-write-tc.md          ← TC 작성 방법
        ├── skill-find-step.md         ← 기존 step 탐색 방법
        ├── skill-request-selector.md  ← selector 요청 형식
        ├── skill-update-docs.md       ← 문서 업데이트 방법
        └── skill-troubleshoot.md      ← 실패 분석 방법
