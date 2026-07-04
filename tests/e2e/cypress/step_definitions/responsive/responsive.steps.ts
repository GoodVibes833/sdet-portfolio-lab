import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { responsiveSelectors } from '../../support/selectors/responsive/responsive.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am viewing the app on a mobile viewport', () => {
  cy.viewport('iphone-x');
  cy.visit('/');
});

Given('I am viewing the app on a tablet viewport', () => {
  cy.viewport('ipad-2');
  cy.visit('/');
});

Given('I am viewing {string} on a mobile viewport', (path: string) => {
  cy.viewport('iphone-x');
  cy.visit(path);
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the page should not have horizontal overflow', () => {
  cy.get(responsiveSelectors.pageBody).then(($body) => {
    expect($body[0].scrollWidth).to.be.lte($body[0].clientWidth);
  });
});

Then('the navbar should be visible on mobile', () => {
  cy.get(responsiveSelectors.mobileNavbar).should('be.visible');
});

Then('the bottom sheet should be scrollable', () => {
  cy.get(responsiveSelectors.bottomSheet).should('be.visible');
});

Then('the explore page should fit within the viewport', () => {
  cy.get(responsiveSelectors.exploreContainer).then(($el) => {
    expect($el[0].scrollWidth).to.be.lte($el[0].clientWidth + 1);
  });
});
