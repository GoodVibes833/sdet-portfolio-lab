import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { gamificationSelectors } from '../../support/selectors/gamification/gamification.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I have gamification data in localStorage', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('gamification', JSON.stringify({
      points: 150,
      level: 2,
      badges: ['first-visit', 'explorer'],
    }));
  });
});

Given('I am on a page with the roulette wheel', () => {
  cy.visit('/');
  cy.get(gamificationSelectors.rouletteWheel).should('be.visible');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I spin the roulette wheel', () => {
  cy.get(gamificationSelectors.spinBtn).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the points display should show updated points', () => {
  cy.get(gamificationSelectors.pointsDisplay).should('be.visible');
});

Then('the level display should be visible', () => {
  cy.get(gamificationSelectors.levelDisplay).should('be.visible');
});

Then('the badge panel should show earned badges', () => {
  cy.get(gamificationSelectors.badgePanel).should('be.visible');
});

Then('the badge {string} should be visible', (badgeId: string) => {
  cy.get(gamificationSelectors.badgeItemName(badgeId)).should('be.visible');
});

Then('the roulette wheel should be visible', () => {
  cy.get(gamificationSelectors.rouletteWheel).should('be.visible');
});

Then('a roulette result should be displayed', () => {
  cy.get(gamificationSelectors.rouletteResult).should('be.visible');
});
