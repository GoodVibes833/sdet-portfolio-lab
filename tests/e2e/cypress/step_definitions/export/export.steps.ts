import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { exportSelectors } from '../../support/selectors/export/export.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on a page with export functionality', () => {
  cy.visit('/');
  cy.get(exportSelectors.csvExportBtn).should('be.visible');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the CSV Export button', () => {
  cy.get(exportSelectors.csvExportBtn).click();
});

When('I click the Print button', () => {
  cy.get(exportSelectors.printBtn).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the CSV export button should be visible', () => {
  cy.get(exportSelectors.csvExportBtn).should('be.visible');
});

Then('the print button should be visible', () => {
  cy.get(exportSelectors.printBtn).should('be.visible');
});
