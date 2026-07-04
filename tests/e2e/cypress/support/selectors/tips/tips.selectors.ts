// Selectors for Tips page — WHATODO-15

export const tipsSelectors = {
  // Page
  tipsPage: '[data-testid="tips-page"]',

  // Content
  tipItem: '[data-testid="tip-item"]',
  tipTitle: '[data-testid="tip-title"]',
  tipContent: '[data-testid="tip-content"]',

  // Category filter (if any)
  tipCategoryFilter: (category: string) => `[data-testid="tip-filter-${category.toLowerCase()}"]`,
};
