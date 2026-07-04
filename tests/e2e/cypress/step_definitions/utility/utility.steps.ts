import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { utilitySelectors } from '../../support/selectors/utility/utility.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on a page with the world clock', () => {
  cy.visit('/');
  cy.get(utilitySelectors.worldClock).should('be.visible');
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the world clock should be visible', () => {
  cy.get(utilitySelectors.worldClock).should('be.visible');
});

Then('the KST time should be displayed', () => {
  cy.get(utilitySelectors.kstTime).should('be.visible');
});

Then('the Canada time should be displayed', () => {
  cy.get(utilitySelectors.canadaTime).should('be.visible');
});

Then('the clock label should be visible', () => {
  cy.get(utilitySelectors.clockLabel).should('be.visible');
});
