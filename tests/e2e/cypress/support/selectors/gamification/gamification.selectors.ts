// Selectors for Gamification — WHATODO-37, WHATODO-38, WHATODO-39

export const gamificationSelectors = {
  // Points & Level (shown on profile page)
  pointsDisplay: '[data-testid="gamification-points"]',
  levelDisplay: '[data-testid="gamification-level"]',
  levelProgressBar: '[data-testid="gamification-level-progress"]',

  // Badges (BadgePanel)
  badgePanel: '[data-testid="badge-panel"]',
  badgeItem: '[data-testid="badge-item"]',
  badgeItemName: (name: string) => `[data-testid="badge-item-${name.toLowerCase().replace(/\s/g, '-')}"]`,
  badgeLocked: '[data-testid="badge-locked"]',
  badgeCondition: '[data-testid="badge-condition"]',

  // Roulette
  roulettePage: '[data-testid="roulette-page"]',
  rouletteWheel: '[data-testid="roulette-wheel"]',
  spinBtn: '[data-testid="roulette-spin-btn"]',
  rouletteResult: '[data-testid="roulette-result"]',
  rouletteResultMsg: '[data-testid="roulette-result-message"]',
};
