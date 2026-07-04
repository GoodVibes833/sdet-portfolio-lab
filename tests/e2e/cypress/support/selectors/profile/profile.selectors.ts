// Selectors for Profile page — WHATODO-10

export const profileSelectors = {
  // Page
  profilePage: '[data-testid="profile-page"]',

  // User info
  username: '[data-testid="profile-username"]',
  email: '[data-testid="profile-email"]',
  avatar: '[data-testid="profile-avatar"]',

  // Stats
  pointsDisplay: '[data-testid="profile-points"]',
  levelDisplay: '[data-testid="profile-level"]',
  visitedCount: '[data-testid="profile-visited-count"]',
  badgePanel: '[data-testid="profile-badge-panel"]',

  // Guest state
  loginPrompt: '[data-testid="profile-login-prompt"]',

  // Logout
  logoutBtn: '[data-testid="profile-logout-btn"]',
};
