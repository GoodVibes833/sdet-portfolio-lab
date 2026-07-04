import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { navigationSelectors } from '../../support/selectors/navigation/navigation.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I open the application', () => {
  cy.visit('/');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I navigate to {string}', (path: string) => {
  cy.visit(path);
});

When('I visit a non-existent page', () => {
  cy.visit('/this-page-does-not-exist', { failOnStatusCode: false });
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the page should load without errors', () => {
  cy.get(navigationSelectors.pageBody).should('be.visible');
  cy.get(navigationSelectors.errorPage).should('not.exist');
});

Then('the 404 page should be displayed', () => {
  cy.get(navigationSelectors.notFoundPage).should('be.visible');
});

Then('I should be on the {string} page', (path: string) => {
  cy.url().should('include', path);
});

Then('the main content should be visible', () => {
  cy.get(navigationSelectors.mainContent).should('be.visible');
});
