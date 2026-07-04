// Selectors for Ranking — WHATODO-09, WHATODO-25

export const rankingSelectors = {
  // Page
  rankingPage: '[data-testid="ranking-page"]',

  // Tabs
  pointsTab: '[data-testid="ranking-tab-points"]',
  visitCountTab: '[data-testid="ranking-tab-visit-count"]',
  badgeTab: '[data-testid="ranking-tab-badge"]',

  // Tab content
  pointsLeaderboard: '[data-testid="ranking-points-leaderboard"]',
  visitCountLeaderboard: '[data-testid="ranking-visit-count-leaderboard"]',
  badgeLeaderboard: '[data-testid="ranking-badge-leaderboard"]',

  // Leaderboard items
  leaderboardItem: '[data-testid="ranking-leaderboard-item"]',
  leaderboardRank: '[data-testid="ranking-item-rank"]',
  leaderboardUsername: '[data-testid="ranking-item-username"]',
  leaderboardScore: '[data-testid="ranking-item-score"]',

  // Top 3 highlight
  topThreeItem: '[data-testid="ranking-top-item"]',
};
