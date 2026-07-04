import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { rankingSelectors } from '../../support/selectors/ranking/ranking.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the ranking page', () => {
  cy.visit('/ranking');
  cy.get(rankingSelectors.rankingPage).should('be.visible');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the Points tab', () => {
  cy.get(rankingSelectors.pointsTab).click();
});

When('I click the Visit Count tab', () => {
  cy.get(rankingSelectors.visitCountTab).click();
});

When('I click the Badge tab', () => {
  cy.get(rankingSelectors.badgeTab).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the ranking page should be visible', () => {
  cy.get(rankingSelectors.rankingPage).should('be.visible');
});

Then('the leaderboard should be visible', () => {
  cy.get(rankingSelectors.leaderboardItem).should('have.length.greaterThan', 0);
});

Then('the Points tab should be active', () => {
  cy.get(rankingSelectors.pointsTab).should('have.attr', 'aria-selected', 'true');
});

Then('the Visit Count tab should be active', () => {
  cy.get(rankingSelectors.visitCountTab).should('have.attr', 'aria-selected', 'true');
});

Then('the Badge tab should be active', () => {
  cy.get(rankingSelectors.badgeTab).should('have.attr', 'aria-selected', 'true');
});

Then('the top 3 entries should be highlighted', () => {
  cy.get(rankingSelectors.topThreeItem).should('have.length.at.least', 1);
});

Then('the leaderboard items should be visible', () => {
  cy.get(rankingSelectors.leaderboardItem).should('have.length.greaterThan', 0);
});
