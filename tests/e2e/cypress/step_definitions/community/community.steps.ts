import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { communitySelectors } from '../../support/selectors/community/community.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the community page', () => {
  cy.visit('/community');
  cy.get(communitySelectors.communityPage).should('be.visible');
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the community page should be visible', () => {
  cy.get(communitySelectors.communityPage).should('be.visible');
});

Then('community posts should be displayed', () => {
  cy.get(communitySelectors.postItem).should('have.length.greaterThan', 0);
});
