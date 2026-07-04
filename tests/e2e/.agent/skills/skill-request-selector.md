# Skill: Selector 요청 형식 (Request Selector)

> selector 파일에 없는 element가 필요할 때 나한테 요청하는 방법.  
> 절대 selector를 추측으로 쓰지 말 것.

---

## 요청 트리거 조건

아래 상황에서 반드시 나한테 요청한다:

```
1. selector 파일에 해당 element가 없을 때
2. data-testid가 없는 element를 써야 할 것 같을 때
3. selector를 추측으로 쓰면 테스트가 깨질 것 같을 때
```

---

## 요청 형식 (이 형식 그대로 사용)

```
[SELECTOR 요청]

티켓: WHATODO-XX
AC: ACN
필요한 element: [element 설명]
위치: [어느 페이지 / 어느 컴포넌트]
용도: [이 element로 뭘 할 건지 — click / should('be.visible') 등]

현재 selector 파일: cypress/support/selectors/[module]/[module].selectors.ts
티켓 파일: .agent/tickets/WHATODO-XX-*.md
```

---

## 요청 예시

```
[SELECTOR 요청]

티켓: WHATODO-09
AC: AC2
필요한 element: 랭킹 페이지의 포인트/방문수/뱃지 탭
위치: /ranking 페이지 상단 탭 영역
용도: 각 탭 클릭 (When) + active 상태 확인 (Then)

현재 selector 파일: cypress/support/selectors/ranking/ranking.selectors.ts (없음 — 신규 생성 필요)
```

---

## 새 Selector 파일 생성 시 형식

나한테 selector를 받으면 아래 형식으로 파일에 추가:

```typescript
// cypress/support/selectors/[module]/[module].selectors.ts

export const [module]Selectors = {
  // [섹션 설명]
  [elementName]: '[data-testid="[testid]"]',
  
  // 동적 selector (파라미터 받는 경우)
  [elementName]: (param: string) => `[data-testid="[testid]-${param}"]`,
};
```

---

## 현재 존재하는 Selector 파일 목록

| 파일 | 모듈 | 주요 selector |
|------|------|--------------|
| `selectors/auth/auth.selectors.ts` | auth | loginModal, loginNavBtn, googleLoginBtn, closeModalBtn, userAvatar, profileLink |
| `selectors/map/map.selectors.ts` | map | mapContainer, cityTab(), filterChip(), bottomSheet, placeCard, mapMarker, markerCluster, myLocationBtn |
| `selectors/explore/explore.selectors.ts` | explore | explorePage, searchInput, searchClearBtn, cityTab(), categoryFilter(), priceFilter(), hiddenSpotFilter, placeCard, placeCount, noResultsMsg |
| `selectors/place/place.selectors.ts` | place | placeTitle, placeCategory, placeRating, visitBtn, inviteBtn, officialWebsiteLink, hiddenSpotBadge, **favoritesBtn, reviewInputArea, memoInputArea, tagItem, shareBtn, sharePanel, inviteModal** |
| `selectors/navbar/navbar.selectors.ts` | navbar | navbar, logo, loginBtn, userAvatar, exploreLink, rankingLink, friendsLink |
| `selectors/ranking/ranking.selectors.ts` | ranking | rankingPage, pointsTab, visitCountTab, badgeTab, leaderboardItem, topThreeItem |
| `selectors/hidden/hidden.selectors.ts` | hidden | hiddenPage, searchInput, cityTab(), categoryFilter(), placeCard |
| `selectors/profile/profile.selectors.ts` | profile | profilePage, username, pointsDisplay, levelDisplay, badgePanel, loginPrompt |
| `selectors/friends/friends.selectors.ts` | friends | friendsPage, friendsListTab, messagesTab, invitationsTab, searchInput, searchResultItem, addFriendBtn, feedPage, chatBtn |
| `selectors/chat/chat.selectors.ts` | chat | chatPage, messageList, messageItem, dateSeparator, readReceipt, chatInput, sendBtn |
| `selectors/tips/tips.selectors.ts` | tips | tipsPage, tipItem, tipTitle |
| `selectors/community/community.selectors.ts` | community | communityPage, postItem |
| `selectors/missions/missions.selectors.ts` | missions | missionsPage, missionItem, missionProgress, completedBadge |
| `selectors/navigation/navigation.selectors.ts` | navigation | pageBody, mainContent, errorPage, notFoundPage |
| `selectors/collections/collections.selectors.ts` | collections | collectionsPage, collectionList, collectionItem, createCollectionBtn, deleteCollectionBtn |
| `selectors/gamification/gamification.selectors.ts` | gamification | pointsDisplay, levelDisplay, badgePanel, badgeItem(), rouletteWheel, spinBtn, rouletteResult |
| `selectors/onboarding/onboarding.selectors.ts` | onboarding | tourContainer, tourStep, nextBtn, skipBtn, finishBtn |
| `selectors/settings/settings.selectors.ts` | settings | settingsBtn, settingsPanel, fontSizeSetting, highContrastToggle |
| `selectors/error/error.selectors.ts` | error | errorPage, notFoundPage, notFoundMessage, backToHomeBtn |
| `selectors/guide/guide.selectors.ts` | guide | guideBtn, guidePanel, closePanelBtn, guideInstructionItem |
| `selectors/export/export.selectors.ts` | export | exportPage, csvExportBtn, printBtn |
| `selectors/utility/utility.selectors.ts` | utility | worldClock, kstTime, canadaTime |
| `selectors/responsive/responsive.selectors.ts` | responsive | pageBody, mainContainer, bottomSheet |
| `selectors/pwa/pwa.selectors.ts` | pwa | installBanner, installBtn |

---

## Selector 파일 완성 상태

✅ **모든 모듈의 selector 파일이 생성됨** (WHATODO-01~50 전체 커버)

새 selector가 필요하면:
1. 위 목록에서 해당 모듈 파일 확인
2. 파일 내 selector 확인 후 없으면 나한테 `[SELECTOR 요청]` 형식으로 요청
3. `data-testid`를 받아서 해당 파일에 추가
