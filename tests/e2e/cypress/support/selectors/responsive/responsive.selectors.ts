// Selectors for Responsive layout checks — WHATODO-45

export const responsiveSelectors = {
  // Generic overflow check targets
  pageBody: 'body',
  mainContainer: '[data-testid="main-container"]',

  // Navbar on mobile
  mobileNavbar: '[data-testid="navbar"]',

  // Bottom sheet scroll
  bottomSheet: '[data-testid="map-bottom-sheet"]',

  // Overflow helpers (used via .invoke('scrollWidth') comparisons)
  exploreContainer: '[data-testid="explore-page"]',
  placeDetailContainer: '[data-testid="place-detail-page"]',
};
