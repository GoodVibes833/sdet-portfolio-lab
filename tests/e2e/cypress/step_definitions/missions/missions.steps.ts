import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { missionsSelectors } from '../../support/selectors/missions/missions.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the missions page', () => {
  cy.visit('/missions');
  cy.get(missionsSelectors.missionsPage).should('be.visible');
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the missions page should be visible', () => {
  cy.get(missionsSelectors.missionsPage).should('be.visible');
});

Then('the mission items should be displayed', () => {
  cy.get(missionsSelectors.missionItem).should('have.length.greaterThan', 0);
});

Then('the mission progress should be visible', () => {
  cy.get(missionsSelectors.missionProgress).should('be.visible');
});

Then('completed missions should show a badge', () => {
  cy.get(missionsSelectors.completedBadge).should('be.visible');
});
