import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { tipsSelectors } from '../../support/selectors/tips/tips.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the tips page', () => {
  cy.visit('/tips');
  cy.get(tipsSelectors.tipsPage).should('be.visible');
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the tips page should be visible', () => {
  cy.get(tipsSelectors.tipsPage).should('be.visible');
});

Then('the tip items should be displayed', () => {
  cy.get(tipsSelectors.tipItem).should('have.length.greaterThan', 0);
});

Then('each tip item should have a title', () => {
  cy.get(tipsSelectors.tipTitle).should('have.length.greaterThan', 0);
});
