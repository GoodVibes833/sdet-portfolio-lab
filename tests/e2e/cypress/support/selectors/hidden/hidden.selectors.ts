// Selectors for Hidden Spots page — WHATODO-08

export const hiddenSelectors = {
  // Page
  hiddenPage: '[data-testid="hidden-page"]',

  // Search
  searchInput: '[data-testid="hidden-search-input"]',
  searchClearBtn: '[data-testid="hidden-search-clear"]',

  // City tabs
  cityTab: (city: string) => `[data-testid="hidden-city-tab-${city.toLowerCase()}"]`,

  // Category filter
  categoryFilter: (category: string) => `[data-testid="hidden-filter-${category.toLowerCase()}"]`,

  // Place cards
  placeCard: '[data-testid="hidden-place-card"]',

  // No results
  noResultsMsg: '[data-testid="hidden-no-results"]',
};
