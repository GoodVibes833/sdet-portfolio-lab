import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { onboardingSelectors } from '../../support/selectors/onboarding/onboarding.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am a new user who has not completed onboarding', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('onboarding-done');
  });
  cy.visit('/');
});

Given('I have already completed onboarding', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('onboarding-done', 'true');
  });
  cy.visit('/');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the Next button in the tour', () => {
  cy.get(onboardingSelectors.nextBtn).click();
});

When('I click the Skip button in the tour', () => {
  cy.get(onboardingSelectors.skipBtn).click();
});

When('I click the Finish button in the tour', () => {
  cy.get(onboardingSelectors.finishBtn).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the onboarding tour should be visible', () => {
  cy.get(onboardingSelectors.tourContainer).should('be.visible');
});

Then('the onboarding tour should not be visible', () => {
  cy.get(onboardingSelectors.tourContainer).should('not.exist');
});

Then('the onboarding tour step should be displayed', () => {
  cy.get(onboardingSelectors.tourStep).should('be.visible');
});

Then('the onboarding-done flag should be set in localStorage', () => {
  cy.window().its('localStorage').invoke('getItem', 'onboarding-done').should('eq', 'true');
});
