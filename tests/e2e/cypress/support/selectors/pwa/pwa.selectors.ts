// Selectors for PWA checks — WHATODO-43
// Note: Most PWA assertions use cy.request() or cy.window() rather than DOM selectors

export const pwaSelectors = {
  // Install banner (if shown)
  installBanner: '[data-testid="pwa-install-banner"]',
  installBtn: '[data-testid="pwa-install-btn"]',
  dismissInstallBtn: '[data-testid="pwa-install-dismiss"]',
};
