// Selectors for Error Handling — WHATODO-44

export const errorSelectors = {
  // Error page
  errorPage: '[data-testid="error-page"]',
  errorMessage: '[data-testid="error-message"]',
  errorCode: '[data-testid="error-code"]',

  // 404 page
  notFoundPage: '[data-testid="not-found-page"]',
  notFoundMessage: '[data-testid="not-found-message"]',
  backToHomeBtn: '[data-testid="back-to-home-btn"]',

  // Inline error states
  networkErrorMsg: '[data-testid="network-error-message"]',
  loadingFailed: '[data-testid="loading-failed"]',
};
