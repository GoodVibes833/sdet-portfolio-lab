# Skill: TC 작성 (Write Test Case)

> 새 TC를 Gherkin 형식으로 작성하는 방법.  
> 이 파일을 읽기 전에 `product-context.md`와 해당 AC 파일을 먼저 읽어라.

---

## 파일 위치 결정

```
cypress/e2e/[module]/[feature-name]/[scenario-name].feature

예:
- cypress/e2e/explore/city-tab/switch-city-explore.feature
- cypress/e2e/ranking/leaderboard.feature
- cypress/e2e/map/bottomsheet/bottomsheet.feature
```

**모듈명**: `product-context.md`의 모듈 목록 참고  
**feature-name**: 기능을 명사구로 (kebab-case)  
**scenario-name**: feature-name과 같거나 더 구체적으로

---

## Gherkin 파일 형식 (반드시 이 형식 따름)

```gherkin
@[module] @[ticket] @[smoke or regression]
Feature: [Module] - [Feature 이름]
  As a [user type]
  I want to [action]
  So that I can [benefit]

  Background:
    Given I am on the [page name]

  Scenario: [시나리오 이름]
    Given [전제 조건]
    When [사용자 행동]
    Then [예상 결과]
    And [추가 검증]
```

---

## 태그 규칙

```
@[module]        필수 — 모듈명 (map, explore, place, auth, friends, chat, ranking, hidden, profile, navbar, navigation)
@[ticket]        필수 — WHATODO-XX 형식
@AC[N]           필수 — 이 TC가 커버하는 AC 번호 (여러 개면 @AC1 @AC2 형식으로)
@smoke           해당 모듈의 핵심 TC (빠르게 돌리는 것)
@regression      전체 회귀 테스트 포함
```

예:
```gherkin
@ranking @WHATODO-09 @AC1 @smoke
```

---

## 기존 TC 예시 (패턴 참고용)

### 단순 페이지 접근 + 요소 확인
```gherkin
Scenario: Ranking leaderboard page loads
  Given I am on the ranking page
  Then the leaderboard should be visible
  And the points tab should be active
```

### 탭 전환
```gherkin
Scenario: Switch to visit count tab
  Given I am on the ranking page
  When I click the "Visit Count" tab
  Then the visit count leaderboard should be visible
  And the "Visit Count" tab should be active
```

### 필터 적용
```gherkin
Scenario: Filter by category
  Given I am on the main map page
  When I click the "Food" filter chip
  Then only Food category markers should be visible on the map
```

---

## Given 단계 — 자주 쓰는 패턴

```gherkin
Given I am on the main map page            → cy.visit('/') + waitForMapToLoad()
Given I am on the explore page             → cy.visit('/explore')
Given I am on the ranking page             → cy.visit('/ranking')
Given I am on the [페이지명] page          → cy.visit('/[path]')
Given the login modal is open              → cy.visit('/') + 로그인 버튼 클릭
Given I have typed {string} in the search  → searchInput.type(keyword)
Given I have selected the {string} filter  → filterChip.click()
```

---

## 주의사항

- **step이 없으면** 먼저 `skill-find-step.md` 확인 → 기존 step 재활용 시도
- **selector가 없으면** `skill-request-selector.md` 형식으로 나한테 요청
- Background에 공통 전제조건 넣기 (같은 페이지 접근이 반복되면)
- Scenario 이름은 영어로, 동사 시작 (Navigate to / Switch to / Filter by / Show / Hide)
- Then 절에서 정확한 숫자 검증 피하기 → `have.length.greaterThan(0)` 권장 (데이터 변동 가능)
