import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { settingsSelectors } from '../../support/selectors/settings/settings.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I have opened the settings panel', () => {
  cy.visit('/');
  cy.get(settingsSelectors.settingsBtn).click();
  cy.get(settingsSelectors.settingsPanel).should('be.visible');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the Settings button', () => {
  cy.get(settingsSelectors.settingsBtn).click();
});

When('I change the font size setting', () => {
  cy.get(settingsSelectors.fontSizeSetting).click();
});

When('I toggle the high contrast mode', () => {
  cy.get(settingsSelectors.highContrastToggle).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the settings panel should be visible', () => {
  cy.get(settingsSelectors.settingsPanel).should('be.visible');
});

Then('the font size setting should be visible', () => {
  cy.get(settingsSelectors.fontSizeSetting).should('be.visible');
});

Then('the high contrast toggle should be visible', () => {
  cy.get(settingsSelectors.highContrastToggle).should('be.visible');
});

Then('the high contrast toggle should be active', () => {
  cy.get(settingsSelectors.highContrastToggle).should('have.attr', 'aria-checked', 'true');
});
