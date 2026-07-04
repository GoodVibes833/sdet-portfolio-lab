import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { navbarSelectors } from '../../support/selectors/navbar/navbar.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the main map page', () => {
  cy.visit('/');
  cy.waitForMapToLoad();
});

Given('I am on the main map page as a guest', () => {
  cy.visit('/');
  cy.waitForMapToLoad();
});

Given('I am on the explore page', () => {
  cy.visit('/explore');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the navbar logo', () => {
  cy.get(navbarSelectors.logo).click();
});

When('I click the explore link in the navbar', () => {
  cy.get(navbarSelectors.exploreLink).click();
});

When('I click the ranking link in the navbar', () => {
  cy.get(navbarSelectors.rankingLink).click();
});

When('I click the friends link in the navbar', () => {
  cy.get(navbarSelectors.friendsLink).click();
});

When('I click the login button in the navbar', () => {
  cy.get(navbarSelectors.loginBtn).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the navbar should be visible', () => {
  cy.get(navbarSelectors.navbar).should('be.visible');
});

Then('the navbar login button should be visible', () => {
  cy.get(navbarSelectors.loginBtn).should('be.visible');
});

Then('the app logo should be visible', () => {
  cy.get(navbarSelectors.logo).should('be.visible');
});

Then('I should be on the main map page', () => {
  cy.url().should('eq', Cypress.config('baseUrl') + '/');
});

Then('I should be on the explore page', () => {
  cy.url().should('include', '/explore');
});

Then('I should be on the ranking page', () => {
  cy.url().should('include', '/ranking');
});

Then('I should be on the friends page', () => {
  cy.url().should('include', '/friends');
});

Then('the user avatar should be visible in the navbar', () => {
  cy.get(navbarSelectors.userAvatar).should('be.visible');
});
