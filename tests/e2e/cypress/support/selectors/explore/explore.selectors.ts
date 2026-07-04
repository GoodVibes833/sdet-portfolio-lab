// Selectors for Explore module (/explore page)
export const exploreSelectors = {
  // Page container
  explorePage: '[data-testid="explore-page"]',

  // Search
  searchInput: '[data-testid="search-input"]',
  searchClearBtn: '[data-testid="search-clear-btn"]',

  // City tabs
  cityTab: (city: string) => `[data-testid="explore-city-tab-${city}"]`,

  // Category filter chips
  categoryFilter: (category: string) => `[data-testid="category-filter-${category}"]`,
  priceFilter: (price: string) => `[data-testid="price-filter-${price}"]`,
  hiddenSpotFilter: '[data-testid="hidden-spot-filter"]',

  // Results
  placeCard: '[data-testid="explore-place-card"]',
  placeCount: '[data-testid="place-count"]',
  noResultsMsg: '[data-testid="no-results"]',
};
