// Selectors for Missions page — WHATODO-17

export const missionsSelectors = {
  // Page
  missionsPage: '[data-testid="missions-page"]',

  // Mission items
  missionItem: '[data-testid="mission-item"]',
  missionTitle: '[data-testid="mission-title"]',
  missionDescription: '[data-testid="mission-description"]',
  missionProgress: '[data-testid="mission-progress"]',
  missionReward: '[data-testid="mission-reward"]',

  // Status
  completedBadge: '[data-testid="mission-completed-badge"]',
  inProgressBadge: '[data-testid="mission-in-progress-badge"]',
};
