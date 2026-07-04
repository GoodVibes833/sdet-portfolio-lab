// Selectors for Friends — WHATODO-11, WHATODO-12, WHATODO-26

export const friendsSelectors = {
  // Page
  friendsPage: '[data-testid="friends-page"]',

  // Tabs
  friendsListTab: '[data-testid="friends-tab-list"]',
  messagesTab: '[data-testid="friends-tab-messages"]',
  invitationsTab: '[data-testid="friends-tab-invitations"]',

  // Tab content
  friendsListContent: '[data-testid="friends-list-content"]',
  messagesContent: '[data-testid="friends-messages-content"]',
  invitationsContent: '[data-testid="friends-invitations-content"]',

  // Friend items
  friendItem: '[data-testid="friend-item"]',
  friendUsername: '[data-testid="friend-item-username"]',

  // Search
  searchInput: '[data-testid="friends-search-input"]',
  searchResultItem: '[data-testid="friends-search-result-item"]',
  addFriendBtn: '[data-testid="friends-add-btn"]',
  noResultsMsg: '[data-testid="friends-no-results"]',

  // Invitation actions
  acceptInviteBtn: '[data-testid="friends-invite-accept"]',
  declineInviteBtn: '[data-testid="friends-invite-decline"]',

  // Guest state
  loginPrompt: '[data-testid="friends-login-prompt"]',

  // Feed page
  feedPage: '[data-testid="friends-feed-page"]',
  feedPlaceCard: '[data-testid="friends-feed-place-card"]',
  chatBtn: '[data-testid="friends-feed-chat-btn"]',
};
