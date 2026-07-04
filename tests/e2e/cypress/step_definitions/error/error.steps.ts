import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { errorSelectors } from '../../support/selectors/error/error.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I navigate to a non-existent page', () => {
  cy.visit('/this-does-not-exist', { failOnStatusCode: false });
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the Back to Home button', () => {
  cy.get(errorSelectors.backToHomeBtn).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the 404 error page should be visible', () => {
  cy.get(errorSelectors.notFoundPage).should('be.visible');
});

Then('a not found message should be displayed', () => {
  cy.get(errorSelectors.notFoundMessage).should('be.visible');
});

Then('I should be redirected to the home page', () => {
  cy.url().should('eq', Cypress.config('baseUrl') + '/');
});
