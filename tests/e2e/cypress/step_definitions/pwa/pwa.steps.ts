import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { pwaSelectors } from '../../support/selectors/pwa/pwa.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I open the app in a browser', () => {
  cy.visit('/');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I check the manifest file', () => {
  cy.request('/manifest.json').as('manifest');
});

When('I check the service worker registration', () => {
  cy.window().then((win) => {
    expect(win.navigator.serviceWorker).to.exist;
  });
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the manifest file should be valid', () => {
  cy.get('@manifest').then((response: any) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('name');
    expect(response.body).to.have.property('icons');
  });
});

Then('the service worker should be registered', () => {
  cy.window().its('navigator.serviceWorker').should('exist');
});

Then('the PWA install banner should be visible', () => {
  cy.get(pwaSelectors.installBanner).should('be.visible');
});
