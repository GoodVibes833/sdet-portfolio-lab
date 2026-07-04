// Selectors for Smoke Navigation — WHATODO-30

export const navigationSelectors = {
  // Generic page body
  pageBody: 'body',

  // Common page containers (used for smoke assertions)
  mainContent: '[data-testid="main-content"]',
  pageContainer: '[data-testid="page-container"]',

  // Error / not found
  errorPage: '[data-testid="error-page"]',
  notFoundPage: '[data-testid="not-found-page"]',
};
