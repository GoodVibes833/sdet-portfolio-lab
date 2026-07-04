import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { guideSelectors } from '../../support/selectors/guide/guide.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on any page of the app', () => {
  cy.visit('/');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the Guide button', () => {
  cy.get(guideSelectors.guideBtn).click();
});

When('I click the Close Panel button', () => {
  cy.get(guideSelectors.closePanelBtn).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the guide panel should be visible', () => {
  cy.get(guideSelectors.guidePanel).should('be.visible');
});

Then('the guide panel should not be visible', () => {
  cy.get(guideSelectors.guidePanel).should('not.exist');
});

Then('guide instructions should be listed', () => {
  cy.get(guideSelectors.guideInstructionItem).should('have.length.greaterThan', 0);
});
