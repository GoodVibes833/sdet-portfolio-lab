// Selectors for Collections — WHATODO-36

export const collectionsSelectors = {
  // Page
  collectionsPage: '[data-testid="collections-page"]',

  // Collection list
  collectionList: '[data-testid="collection-list"]',
  collectionItem: '[data-testid="collection-item"]',
  collectionName: '[data-testid="collection-item-name"]',

  // Create collection
  createCollectionBtn: '[data-testid="collection-create-btn"]',
  collectionNameInput: '[data-testid="collection-name-input"]',
  collectionSaveBtn: '[data-testid="collection-save-btn"]',

  // Collection detail
  collectionDetail: '[data-testid="collection-detail"]',
  collectionPlaceItem: '[data-testid="collection-place-item"]',

  // Actions
  deleteCollectionBtn: '[data-testid="collection-delete-btn"]',
  removePlaceBtn: '[data-testid="collection-remove-place-btn"]',

  // Add to collection (on place detail page)
  addToCollectionBtn: '[data-testid="place-add-to-collection-btn"]',
  collectionSelectDropdown: '[data-testid="collection-select-dropdown"]',
};
