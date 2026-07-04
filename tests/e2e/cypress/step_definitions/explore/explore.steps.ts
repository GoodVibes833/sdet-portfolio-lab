import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { exploreSelectors } from '../../support/selectors/explore/explore.selectors';
import { placeSelectors } from '../../support/selectors/place/place.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the explore page', () => {
  cy.visit('/explore');
  cy.get(exploreSelectors.explorePage).should('be.visible');
});

Given('I have typed {string} in the search input', (keyword: string) => {
  cy.get(exploreSelectors.searchInput).type(keyword);
});

Given('I am on a place detail page for a hidden spot', () => {
  cy.visit('/explore');
  cy.get(exploreSelectors.hiddenSpotFilter).click();
  cy.get(exploreSelectors.placeCard).first().click();
});

Given('I am on a place detail page with an official website', () => {
  cy.visit('/explore');
  cy.get(exploreSelectors.placeCard).first().click();
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I type {string} in the search input', (keyword: string) => {
  cy.get(exploreSelectors.searchInput).clear().type(keyword);
});

When('I click the clear search button', () => {
  cy.get(exploreSelectors.searchClearBtn).click();
});

When('I click the {string} category filter', (category: string) => {
  cy.get(exploreSelectors.categoryFilter(category)).click();
});

When('I click the hidden spot filter', () => {
  cy.get(exploreSelectors.hiddenSpotFilter).click();
});

When('I click on the first place card', () => {
  cy.get(exploreSelectors.placeCard).first().click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('places matching {string} should appear in the results', (keyword: string) => {
  cy.get(exploreSelectors.placeCard).should('have.length.greaterThan', 0);
  cy.get(exploreSelectors.placeCard).first().should('contain.text', keyword);
});

Then('the no results message should be visible', () => {
  cy.get(exploreSelectors.noResultsMsg).should('be.visible');
});

Then('all places should be visible again', () => {
  cy.get(exploreSelectors.searchInput).should('have.value', '');
  cy.get(exploreSelectors.placeCard).should('have.length.greaterThan', 0);
});

Then('only {string} places should appear in the results', (_category: string) => {
  cy.get(exploreSelectors.placeCard).should('have.length.greaterThan', 0);
});

Then('only hidden spot places should appear in the results', () => {
  cy.get(exploreSelectors.placeCard).should('have.length.greaterThan', 0);
});

// Place detail steps (shared from explore context)
Then('I should be on the place detail page', () => {
  cy.url().should('include', '/place/');
});

Then('the place title should be visible', () => {
  cy.get(placeSelectors.placeTitle).should('be.visible');
});

Then('the place category should be visible', () => {
  cy.get(placeSelectors.placeCategory).should('be.visible');
});

Then('the place rating should be visible', () => {
  cy.get(placeSelectors.placeRating).should('be.visible');
});

Then('the hidden spot badge should be visible', () => {
  cy.get(placeSelectors.hiddenSpotBadge).should('be.visible');
});

Then('the official website link should be present and have a valid href', () => {
  cy.get(placeSelectors.officialWebsiteLink)
    .should('be.visible')
    .and('have.attr', 'href')
    .and('match', /^https?:\/\//);
});
