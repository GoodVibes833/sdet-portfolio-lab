# Skill: 기존 Step 탐색 및 재활용 (Find & Reuse Step)

> 새 TC 작성 시 step을 먼저 여기서 찾아라.  
> 새로 만들기 전에 반드시 기존 step을 확인한다.

---

## 탐색 순서

```
1. 해당 모듈의 step 파일 먼저 읽기
   cypress/step_definitions/[module]/[module].steps.ts

2. 키워드로 매칭 step 찾기
   Given/When/Then 텍스트를 AC 내용과 대조

3. 없으면 다른 모듈 step 파일도 확인
   (특히 공통 Given 패턴은 다른 모듈에 이미 있을 수 있음)

4. 그래도 없으면 → 새 step 작성
```

---

## 현재 존재하는 Step 파일 목록

| 파일 | 모듈 | 주요 커버 기능 |
|------|------|--------------|
| `step_definitions/auth/auth.steps.ts` | auth | 로그인 모달, 구글 버튼, 아바타 |
| `step_definitions/map/map.steps.ts` | map | 지도, 필터칩, 도시탭, 마커, 바텀시트 |
| `step_definitions/explore/explore.steps.ts` | explore | 검색, 카테고리 필터, 히든스팟 필터, 장소 카드 |
| `step_definitions/navbar/navbar.steps.ts` | navbar | 로고, 링크 클릭, 로그인 버튼, URL 검증 |
| `step_definitions/navigation/navigation.steps.ts` | navigation | 페이지 이동, 404, 에러 없음 확인 |
| `step_definitions/ranking/ranking.steps.ts` | ranking | 랭킹 페이지, 탭 전환, 리더보드 |
| `step_definitions/hidden/hidden.steps.ts` | hidden | 히든스팟 페이지, 카테고리 필터, 검색 |
| `step_definitions/profile/profile.steps.ts` | profile | 프로필 페이지, 포인트, 레벨, 뱃지, 로그인 프롬프트 |
| `step_definitions/friends/friends.steps.ts` | friends | 친구 목록/검색/추가, 피드, 채팅 버튼 |
| `step_definitions/chat/chat.steps.ts` | chat | 채팅 페이지, 메시지 전송, 날짜 구분, 읽음 표시 |
| `step_definitions/tips/tips.steps.ts` | tips | 팁 페이지, 팁 목록 |
| `step_definitions/community/community.steps.ts` | community | 커뮤니티 페이지, 포스트 목록 |
| `step_definitions/missions/missions.steps.ts` | missions | 미션 페이지, 미션 목록, 진행도, 완료 뱃지 |
| `step_definitions/place/place.steps.ts` | place | 찜/방문/리뷰/메모/태그/공유 (localStorage 기반) |
| `step_definitions/collections/collections.steps.ts` | collections | 컬렉션 CRUD (localStorage 기반) |
| `step_definitions/gamification/gamification.steps.ts` | gamification | 포인트, 레벨, 뱃지, 룰렛 |
| `step_definitions/onboarding/onboarding.steps.ts` | onboarding | 투어 시작/스킵/완료, localStorage 플래그 |
| `step_definitions/settings/settings.steps.ts` | settings | 설정 패널, 폰트 크기, 고대비 모드 |
| `step_definitions/error/error.steps.ts` | error | 404 페이지, 홈으로 이동 |
| `step_definitions/responsive/responsive.steps.ts` | responsive | 뷰포트 설정, 오버플로우 검증 |
| `step_definitions/pwa/pwa.steps.ts` | pwa | manifest 요청, 서비스워커, 설치 배너 |
| `step_definitions/export/export.steps.ts` | export | CSV 내보내기, 프린트 버튼 |
| `step_definitions/utility/utility.steps.ts` | utility | 세계시계 (KST, Canada) |
| `step_definitions/guide/guide.steps.ts` | guide | 가이드 패널 열기/닫기, 항목 목록 |

---

## Step 파일 완성 상태

✅ **모든 모듈의 step 파일이 생성됨** (WHATODO-01~50 전체 커버)

새 step이 필요하면:
1. 위 목록에서 해당 모듈 step 파일 확인
2. 재사용 가능한 step 있는지 확인 후 없으면 해당 파일에 추가

> 공통 Given 패턴 (`I am on the X page`)은 각 모듈 파일에 분산됨.  
> 중복이 많아지면 `step_definitions/common/common.steps.ts`로 통합 고려 (추후 리팩토링)

---

## 재사용 가능한 주요 Step 목록

### Given (전제 조건)

| Step 텍스트 | 파일 | 동작 |
|------------|------|------|
| `I am on the main map page` | map.steps.ts | `cy.visit('/') + waitForMapToLoad()` |
| `I am on the main map page as a guest` | map.steps.ts | 동일 |
| `I am on the explore page` | explore.steps.ts | `cy.visit('/explore')` |
| `the login modal is open` | auth.steps.ts | `/` 방문 후 로그인 버튼 클릭 |
| `I have typed {string} in the search input` | explore.steps.ts | searchInput.type() |
| `I have selected the {string} filter chip` | map.steps.ts | filterChip.click() |
| `I am on a place detail page for a hidden spot` | explore.steps.ts | 히든스팟 필터 후 첫 카드 클릭 |
| `I am on a place detail page with an official website` | explore.steps.ts | 첫 카드 클릭 |

### When (행동)

| Step 텍스트 | 파일 | 동작 |
|------------|------|------|
| `I click the login button in the navbar` | auth.steps.ts | loginNavBtn.click() |
| `I click the close button` | auth.steps.ts | closeModalBtn.click() |
| `I click outside the login modal` | auth.steps.ts | body.click(10,10) |
| `I type {string} in the search input` | explore.steps.ts | searchInput.clear().type() |
| `I click the clear search button` | explore.steps.ts | searchClearBtn.click() |
| `I click the {string} category filter` | explore.steps.ts | categoryFilter(category).click() |
| `I click the hidden spot filter` | explore.steps.ts | hiddenSpotFilter.click() |
| `I click on the first place card` | explore.steps.ts | placeCard.first().click() |
| `I click the {string} filter chip` | map.steps.ts | filterChip(category).click() |
| `I click the {string} city tab` | map.steps.ts | cityTab(city).click() |

### Then (결과 검증)

| Step 텍스트 | 파일 | 동작 |
|------------|------|------|
| `the login modal should be visible` | auth.steps.ts | loginModal.should('be.visible') |
| `the login modal should not be visible` | auth.steps.ts | loginModal.should('not.exist') |
| `the Google login button should be present` | auth.steps.ts | googleLoginBtn.should('be.visible') |
| `the user avatar should be displayed` | auth.steps.ts | userAvatar.should('be.visible') |
| `places matching {string} should appear` | explore.steps.ts | placeCard 존재 + 텍스트 포함 |
| `the no results message should be visible` | explore.steps.ts | noResultsMsg.should('be.visible') |
| `all places should be visible again` | explore.steps.ts | searchInput 빈값 + placeCard 존재 |
| `I should be on the place detail page` | explore.steps.ts | url includes '/place/' |
| `the place title should be visible` | explore.steps.ts | placeTitle.should('be.visible') |
| `the place rating should be visible` | explore.steps.ts | placeRating.should('be.visible') |
| `the hidden spot badge should be visible` | explore.steps.ts | hiddenSpotBadge.should('be.visible') |
| `the official website link should be present` | explore.steps.ts | officialWebsiteLink + href 검증 |
| `the {string} city tab should be active` | map.steps.ts | cityTab.should('have.attr', 'aria-selected', 'true') |
| `the map should be centered on Toronto` | map.steps.ts | mapContainer.should('be.visible') |
| `only {string} category markers should be visible` | map.steps.ts | mapMarker.should('exist') |
| `all place markers should be visible on the map` | map.steps.ts | mapMarker.should('exist') |

---

## 새 Step 작성 시 규칙

기존 step이 없어서 새로 작성해야 할 때:

```typescript
// 파일: cypress/step_definitions/[module]/[module].steps.ts
// 없으면 새 파일 생성

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { [module]Selectors } from '../../support/selectors/[module]/[module].selectors';

// ─── Given ───
Given('I am on the [페이지] page', () => {
  cy.visit('/[path]');
  cy.get('body').should('be.visible');
});

// ─── When ────
When('I click the {string} tab', (tabName: string) => {
  cy.contains('[data-testid 또는 role="tab"]', tabName).click();
});

// ─── Then ────
Then('the [요소] should be visible', () => {
  cy.get([module]Selectors.[selector]).should('be.visible');
});
```

**주의**: selector가 없으면 먼저 `skill-request-selector.md`로 나한테 요청하고 받은 후 작성.
