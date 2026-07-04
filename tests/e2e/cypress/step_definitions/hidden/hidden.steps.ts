import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { hiddenSelectors } from '../../support/selectors/hidden/hidden.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the hidden spots page', () => {
  cy.visit('/hidden');
  cy.get(hiddenSelectors.hiddenPage).should('be.visible');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I filter hidden spots by {string} category', (category: string) => {
  cy.get(hiddenSelectors.categoryFilter(category)).click();
});

When('I switch to the {string} city tab on the hidden page', (city: string) => {
  cy.get(hiddenSelectors.cityTab(city)).click();
});

When('I search for {string} on the hidden page', (query: string) => {
  cy.get(hiddenSelectors.searchInput).type(query);
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the hidden spots page should be visible', () => {
  cy.get(hiddenSelectors.hiddenPage).should('be.visible');
});

Then('only hidden spot places should be displayed', () => {
  cy.get(hiddenSelectors.placeCard).should('have.length.greaterThan', 0);
});

Then('the hidden spot place cards should be visible', () => {
  cy.get(hiddenSelectors.placeCard).should('have.length.greaterThan', 0);
});
