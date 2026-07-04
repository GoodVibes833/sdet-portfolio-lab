import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { collectionsSelectors } from '../../support/selectors/collections/collections.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the collections page', () => {
  cy.visit('/collections');
  cy.get(collectionsSelectors.collectionsPage).should('be.visible');
});

Given('I have an existing collection {string}', (name: string) => {
  cy.window().then((win) => {
    const collections = [{ id: '1', name, places: [] }];
    win.localStorage.setItem('collections', JSON.stringify(collections));
  });
  cy.reload();
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the Create Collection button', () => {
  cy.get(collectionsSelectors.createCollectionBtn).click();
});

When('I type a collection name {string}', (name: string) => {
  cy.get(collectionsSelectors.collectionNameInput).type(name);
});

When('I click the Save Collection button', () => {
  cy.get(collectionsSelectors.collectionSaveBtn).click();
});

When('I click the Delete Collection button', () => {
  cy.get(collectionsSelectors.deleteCollectionBtn).first().click();
});

When('I click on the collection {string}', (name: string) => {
  cy.get(collectionsSelectors.collectionItem).contains(name).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the collections page should be visible', () => {
  cy.get(collectionsSelectors.collectionsPage).should('be.visible');
});

Then('the collection {string} should appear in the list', (name: string) => {
  cy.get(collectionsSelectors.collectionItem).contains(name).should('be.visible');
});

Then('the collection {string} should not exist', (name: string) => {
  cy.get(collectionsSelectors.collectionItem).contains(name).should('not.exist');
});

Then('the collection list should be visible', () => {
  cy.get(collectionsSelectors.collectionList).should('be.visible');
});
