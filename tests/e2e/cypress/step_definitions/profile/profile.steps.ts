import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { profileSelectors } from '../../support/selectors/profile/profile.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the profile page', () => {
  cy.visit('/profile');
  cy.get(profileSelectors.profilePage).should('be.visible');
});

Given('I am logged in and on the profile page', () => {
  cy.visit('/profile');
  cy.get(profileSelectors.profilePage).should('be.visible');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I visit the profile page', () => {
  cy.visit('/profile');
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the profile page should be visible', () => {
  cy.get(profileSelectors.profilePage).should('be.visible');
});

Then('the username should be displayed', () => {
  cy.get(profileSelectors.username).should('be.visible');
});

Then('the points display should be visible', () => {
  cy.get(profileSelectors.pointsDisplay).should('be.visible');
});

Then('the level display should be visible', () => {
  cy.get(profileSelectors.levelDisplay).should('be.visible');
});

Then('the badge panel should be visible', () => {
  cy.get(profileSelectors.badgePanel).should('be.visible');
});

Then('a login prompt should be displayed', () => {
  cy.get(profileSelectors.loginPrompt).should('be.visible');
});
