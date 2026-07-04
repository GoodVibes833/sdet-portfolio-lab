// Selectors for Place module (place detail page)
export const placeSelectors = {
  // Place detail page
  placeTitle: '[data-testid="place-title"]',
  placeCategory: '[data-testid="place-category"]',
  placeRating: '[data-testid="place-rating"]',
  placeAddress: '[data-testid="place-address"]',
  placeDescription: '[data-testid="place-description"]',
  placeImage: '[data-testid="place-image"]',

  // Action buttons
  visitBtn: '[data-testid="mark-visited-btn"]',
  inviteBtn: '[data-testid="invite-btn"]',
  officialWebsiteLink: '[data-testid="official-website-link"]',

  // Source links
  sourceLinksSection: '[data-testid="source-links"]',
  bestSeasonBadge: '[data-testid="best-season"]',

  // Hidden spot badge
  hiddenSpotBadge: '[data-testid="hidden-spot-badge"]',

  // Favorites — WHATODO-31
  favoritesBtn: '[data-testid="favorites-btn"]',
  favoritesActive: '[data-testid="favorites-btn"][data-active="true"]',
  favoritesInactive: '[data-testid="favorites-btn"][data-active="false"]',

  // Visited state — WHATODO-32
  visitBtnActive: '[data-testid="mark-visited-btn"][data-active="true"]',
  visitBtnInactive: '[data-testid="mark-visited-btn"][data-active="false"]',

  // Review — WHATODO-33
  reviewInputArea: '[data-testid="review-input"]',
  reviewSaveBtn: '[data-testid="review-save-btn"]',
  reviewDisplay: '[data-testid="review-display"]',
  reviewEditBtn: '[data-testid="review-edit-btn"]',
  reviewDeleteBtn: '[data-testid="review-delete-btn"]',

  // Memo — WHATODO-34
  memoInputArea: '[data-testid="memo-input"]',
  memoSaveBtn: '[data-testid="memo-save-btn"]',
  memoDisplay: '[data-testid="memo-display"]',
  memoEditBtn: '[data-testid="memo-edit-btn"]',

  // Tags — WHATODO-35
  tagInputArea: '[data-testid="tag-input"]',
  tagAddBtn: '[data-testid="tag-add-btn"]',
  tagItem: '[data-testid="tag-item"]',
  tagDeleteBtn: (tagName: string) => `[data-testid="tag-delete-${tagName}"]`,

  // Share — WHATODO-40
  shareBtn: '[data-testid="share-btn"]',
  sharePanel: '[data-testid="share-panel"]',
  qrCodeOption: '[data-testid="share-qr-option"]',
  qrCodeImage: '[data-testid="share-qr-image"]',
  copyUrlOption: '[data-testid="share-copy-url"]',
  copyUrlBtn: '[data-testid="share-copy-url-btn"]',

  // Invite modal — WHATODO-14
  inviteModal: '[data-testid="invite-modal"]',
  inviteFriendItem: '[data-testid="invite-friend-item"]',
  inviteConfirmBtn: '[data-testid="invite-confirm-btn"]',
  inviteCalendarLink: '[data-testid="invite-calendar-link"]',

  // Add to collection — WHATODO-36
  addToCollectionBtn: '[data-testid="place-add-to-collection-btn"]',
};
