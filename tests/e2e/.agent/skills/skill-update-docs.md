# Skill: 문서 업데이트 (Update Docs)

> TC 작성 완료 또는 TC 실행 후 반드시 이 skill대로 문서를 업데이트한다.  
> **QA-STATUS-REPORT.md 는 에이전트가 건드리지 않는다.** 사람이 스프린트 단위로 수동 갱신.

---

## 업데이트 트리거

| 상황 | 업데이트 대상 |
|------|-------------|
| 기존 TC에 태그만 추가 | tickets/WHATODO-XX.md + test-plan-status.md |
| 새 TC 작성 완료 | tickets/WHATODO-XX.md + test-plan-status.md + feature 파일 |
| TC 실행 완료 (pass/fail) | tickets/WHATODO-XX.md (Last Run + Result) + test-plan-status.md 수치 |
| 새 step 작성 | step 파일 |
| 새 selector 추가 | selector 파일 |
| QA-STATUS-REPORT.md | ❌ 에이전트 수정 금지 (사람 전용) |

---

## 1. tickets 파일 업데이트

**파일**: `.agent/tickets/WHATODO-XX-*.md`

변경 내용:
```markdown
# Before
| AC1 | 내용 | — | not covered |

# After
| AC1 | 내용 | `[feature파일명]` Scenario N | covered |
```

그리고 TC 목록 테이블에 행 추가:
```markdown
| WHATODO-XX-TCN | [Scenario 이름] | `cypress/e2e/[module]/[feature]/[file].feature:[line]` |
```

---

## 2. test-plan-status.md 업데이트

**파일**: `.agent/test-plan-status.md`

### 2-1. 티켓 인덱스 테이블 갱신

```markdown
# Before
| WHATODO-XX | ranking | 6 | 0 | 0% | ❌ |

# After
| WHATODO-XX | ranking | 6 | 4 | 67% | ✅ |
```

### 2-2. 해당 티켓 섹션의 TC 테이블 추가/갱신

TC 새로 작성한 경우:
```markdown
| TC ID | Scenario | AC 커버 | Last Run | Result |
|-------|----------|---------|----------|--------|
| WHATODO-XX-TC1 | [Scenario 이름] | AC1, AC2 | — | — |
```

TC 실행 완료한 경우:
```markdown
| WHATODO-XX-TC1 | [Scenario 이름] | AC1, AC2 | 2026-05-17 | ✅ PASS |
                                                              또는 ❌ FAIL
```

### 2-3. AC 상태 갱신

```markdown
# Before
| AC1 — 내용 | ❌ not covered |

# After
| AC1 — 내용 | ✅ covered |
```

### 2-4. Coverage 수치 갱신

```markdown
**Coverage**: N/M (X%)
```

### 2-5. 전체 요약 갱신 (마지막에)

```markdown
| **총 AC 수** | 88 |
| **Covered AC** | [갱신] |
| **AC Coverage** | [갱신]% |
| **총 TC 수** | [갱신] |
```

---

## 3. test-plan-status 업데이트 시 주의사항

```
✅ 해당 티켓 섹션만 수정 — 다른 티켓 섹션 건드리지 말 것
✅ TC ID는 WHATODO-XX-TC[N] 형식 유지
✅ Last Run은 YYYY-MM-DD 형식
✅ Result는 ✅ PASS 또는 ❌ FAIL
✅ Coverage 계산: covered AC 수 / 전체 AC 수
❌ 형식 임의 변경 금지
❌ 기존 행 삭제 금지
```

---

## 4. feature 파일에 태그 추가 (기존 TC 재사용 경우)

기존 시나리오가 AC를 커버한다고 판단되면 태그 추가:

```gherkin
# Before
@map @smoke
Scenario: Filter places by Food category

# After
@map @smoke @WHATODO-04 @AC1 @AC2
Scenario: Filter places by Food category
```

---

## 전체 체크리스트 (작업 완료 전 확인)

```
[tickets/WHATODO-XX.md]
□ AC covered 상태 변경했는가?
□ TC 목록에 새 TC 추가했는가?
□ Last Run 날짜 업데이트했는가? (YYYY-MM-DD)
□ Result 표시했는가? (✅ PASS / ❌ FAIL)

[test-plan-status.md]
□ 해당 티켓 섹션 coverage 수치 갱신했는가?
□ 전체 요약 수치 갱신했는가?

[feature 파일] (태그 추가 경로인 경우)
□ @WHATODO-XX @ACN 태그 추가했는가?

[QA-STATUS-REPORT.md]
❌ 에이전트 수정 금지 — 이 체크리스트에서 제외
```
