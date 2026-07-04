# Skill: 실패 분석 (Troubleshoot TC Failure)

> TC 실행 실패 시 원인을 분석하는 방법.  
> 에이전트는 코드/로그 레벨만 분석한다. UI/flow 판단은 나(사람)가 한다.

---

## 기본 원칙

```
에이전트가 분석할 수 있는 것:
  ✅ 에러 메시지 해석 (timeout, element not found, assertion fail)
  ✅ selector 문제 (잘못된 data-testid, element 구조 변경)
  ✅ step 코드 버그 (잘못된 assertion, 타이밍 문제)
  ✅ feature 파일 문법 오류

에이전트가 분석할 수 없는 것:
  ❌ 화면에서 실제로 뭐가 보이는지
  ❌ 앱의 현재 상태 (로딩 중인지, 다른 페이지로 이동했는지)
  ❌ 이 실패가 테스트 코드 문제인지 실제 앱 버그인지
  → 이건 나(사람)가 직접 실행해서 판단
```

---

## 실패 보고 형식 (나한테 받아야 하는 정보)

나한테 이 형식으로 정보를 요청해라:

```
[실패 분석 요청]

실패한 TC: WHATODO-XX-TCN
Scenario: [시나리오 이름]

아래 정보를 제공해주세요:
1. Cypress 에러 로그 (터미널 출력 전체 또는 핵심 에러 메시지)
2. 실패한 element의 HTML (DevTools에서 복사)
3. 내가 본 것: [화면 상태 — 버튼이 안 보임 / 로딩 중 / 다른 페이지로 이동 등]
```

---

## 에러 유형별 분석 패턴

### 1. Element not found (Timeout)
```
에러: Timed out retrying after 4000ms: Expected to find element: '[data-testid="xxx"]'

분석 순서:
1. selector 파일에서 해당 selector 확인
2. data-testid가 실제 DOM에 있는지 → 나한테 HTML 요청
3. 페이지 로딩이 완료됐는지 → cy.wait() 또는 다른 element 먼저 기다리기
4. 조건부 렌더링 여부 → 로그인 상태 등 전제조건 확인
```

### 2. Assertion Failed
```
에러: AssertionError: expected ... to ... but got ...

분석 순서:
1. 기대값 vs 실제값 확인
2. 텍스트 대소문자, 공백 확인
3. attribute 이름 확인 (aria-selected vs aria-pressed 등)
4. 동적 데이터면 정확한 값 검증 대신 존재 여부로 완화
```

### 3. URL Assertion Failed
```
에러: expected 'http://localhost:3001/xxx' to include '/yyy'

분석 순서:
1. 실제 라우팅 경로 확인 (product-context.md 모듈 목록)
2. 클릭한 element가 올바른 링크인지 확인
3. 페이지 이동 완료 전에 assertion 했는지 → cy.url().should() 앞에 cy.wait() 추가
```

### 4. Map 관련 실패
```
에러: Leaflet 관련 / .leaflet-container timeout

분석 순서:
1. waitForMapToLoad() 커스텀 커맨드 사용했는지 확인
2. cy.visit('/') 후 충분한 대기 시간 있는지
3. 지도 로딩 조건 — .leaflet-container + .leaflet-tile-loaded 둘 다 필요
```

---

## 수정 전 반드시 확인

```
□ 에러 로그를 나한테 받았는가?
□ 실패한 element HTML을 나한테 받았는가?
□ "내가 본 것" 코멘트를 나한테 받았는가?
□ 위 세 가지 없이 수정하려고 하지 않는가?
```

---

## 실패가 반복될 때

3번 이상 같은 TC가 실패하면 진행 중단 후 나한테 보고:

```
[반복 실패 보고]

TC: WHATODO-XX-TCN
시도 횟수: 3
시도한 수정: [목록]
현재 에러: [에러 메시지]
추정 원인: [코드/selector/앱 버그 중 어느 것인지 추정]
필요한 것: [selector 확인 / 앱 동작 확인 / 다른 접근 방법 논의]
```
