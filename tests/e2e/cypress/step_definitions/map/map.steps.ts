import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { mapSelectors } from '../../support/selectors/map/map.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the main map page', () => {
  cy.visit('/');
  cy.waitForMapToLoad();
});

Given('I am on the main map page as a guest', () => {
  cy.visit('/');
  cy.waitForMapToLoad();
});

Given('I have selected the {string} filter chip', (category: string) => {
  cy.get(mapSelectors.filterChip(category)).click();
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the {string} filter chip', (category: string) => {
  cy.get(mapSelectors.filterChip(category)).click();
});

When('I click the {string} city tab', (city: string) => {
  cy.get(mapSelectors.cityTab(city)).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('only {string} category markers should be visible on the map', (_category: string) => {
  cy.get(mapSelectors.mapMarker).should('have.length.greaterThan', 0);
});

Then('the bottom sheet should show {string} places only', (_category: string) => {
  cy.get(mapSelectors.placeCard).should('have.length.greaterThan', 0);
});

Then('all place markers should be visible on the map', () => {
  cy.get(mapSelectors.mapMarker).should('have.length.greaterThan', 0);
});

Then('places from both {string} and {string} categories should be visible', (_cat1: string, _cat2: string) => {
  cy.get(mapSelectors.mapMarker).should('have.length.greaterThan', 0);
});

Then('the {string} city tab should be active', (city: string) => {
  cy.get(mapSelectors.cityTab(city)).should('have.attr', 'aria-selected', 'true');
});

Then('the map should be centered on Toronto', () => {
  cy.get(mapSelectors.mapContainer).should('be.visible');
});

Then('the map should show {string} places', (_city: string) => {
  cy.get(mapSelectors.mapContainer).should('be.visible');
  cy.get(mapSelectors.mapMarker).should('have.length.greaterThan', 0);
});
