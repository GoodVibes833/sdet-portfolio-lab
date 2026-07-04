import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { authSelectors } from '../../support/selectors/auth/auth.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('the login modal is open', () => {
  cy.visit('/');
  cy.get('body').should('be.visible');
  cy.get(authSelectors.loginNavBtn).click();
  cy.get(authSelectors.loginModal).should('be.visible');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the login button in the navbar', () => {
  cy.get(authSelectors.loginNavBtn).click();
});

When('I click the close button', () => {
  cy.get(authSelectors.closeModalBtn).click();
});

When('I click outside the login modal', () => {
  cy.get('body').click(10, 10);
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the login modal should be visible', () => {
  cy.get(authSelectors.loginModal).should('be.visible');
});

Then('the Google login button should be present', () => {
  cy.get(authSelectors.googleLoginBtn).should('be.visible');
});

Then('the login modal should not be visible', () => {
  cy.get(authSelectors.loginModal).should('not.exist');
});

Then('the user avatar should be displayed', () => {
  cy.get(authSelectors.userAvatar).should('be.visible');
});
