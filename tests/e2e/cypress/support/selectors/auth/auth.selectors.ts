// Selectors for Auth module (login flow)
export const authSelectors = {
  // Login modal
  loginModal: '[data-testid="login-modal"]',
  loginModalTitle: '[data-testid="login-modal-title"]',
  googleLoginBtn: '[data-testid="google-login-btn"]',
  closeModalBtn: '[data-testid="close-modal-btn"]',

  // Navbar auth state
  loginNavBtn: '[data-testid="nav-login-btn"]',
  userAvatar: '[data-testid="user-avatar"]',
  userAvatarImg: '[data-testid="user-avatar"] img',

  // Profile
  profileLink: '[data-testid="nav-profile-link"]',
};
