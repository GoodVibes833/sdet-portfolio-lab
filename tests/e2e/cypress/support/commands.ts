// Custom Cypress commands for 캐나다가자 app

declare global {
  namespace Cypress {
    interface Chainable {
      navigateTo(path: string): Chainable<void>;
      waitForMapToLoad(): Chainable<void>;
    }
  }
}

// Navigate to a page and wait for it to be ready
Cypress.Commands.add('navigateTo', (path: string) => {
  cy.visit(path);
  cy.get('body').should('be.visible');
});

// Wait for Leaflet map to finish loading
Cypress.Commands.add('waitForMapToLoad', () => {
  cy.get('.leaflet-container', { timeout: 10000 }).should('be.visible');
  cy.get('.leaflet-tile-loaded', { timeout: 10000 }).should('exist');
});

export {};
