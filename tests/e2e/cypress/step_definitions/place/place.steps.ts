import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { placeSelectors } from '../../support/selectors/place/place.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the place detail page for place {string}', (placeId: string) => {
  cy.visit(`/place/${placeId}`);
  cy.get(placeSelectors.placeTitle).should('be.visible');
});

Given('I have added place {string} to favorites', (placeId: string) => {
  cy.visit(`/place/${placeId}`);
  cy.window().then((win) => {
    win.localStorage.setItem('favorites', JSON.stringify([placeId]));
  });
  cy.reload();
});

// ─── When — Favorites ─────────────────────────────────────────────────────────

When('I click the Favorites button', () => {
  cy.get(placeSelectors.favoritesBtn).click();
});

// ─── When — Visited ───────────────────────────────────────────────────────────

When('I click the Mark Visited button', () => {
  cy.get(placeSelectors.visitBtn).click();
});

// ─── When — Review ────────────────────────────────────────────────────────────

When('I type a review {string}', (review: string) => {
  cy.get(placeSelectors.reviewInputArea).type(review);
});

When('I click the Save Review button', () => {
  cy.get(placeSelectors.reviewSaveBtn).click();
});

When('I click the Edit Review button', () => {
  cy.get(placeSelectors.reviewEditBtn).click();
});

When('I click the Delete Review button', () => {
  cy.get(placeSelectors.reviewDeleteBtn).click();
});

// ─── When — Memo ──────────────────────────────────────────────────────────────

When('I type a memo {string}', (memo: string) => {
  cy.get(placeSelectors.memoInputArea).type(memo);
});

When('I click the Save Memo button', () => {
  cy.get(placeSelectors.memoSaveBtn).click();
});

// ─── When — Tags ──────────────────────────────────────────────────────────────

When('I type a tag {string}', (tag: string) => {
  cy.get(placeSelectors.tagInputArea).type(tag);
});

When('I click the Add Tag button', () => {
  cy.get(placeSelectors.tagAddBtn).click();
});

When('I click the delete button for tag {string}', (tagName: string) => {
  cy.get(placeSelectors.tagDeleteBtn(tagName)).click();
});

// ─── When — Share ─────────────────────────────────────────────────────────────

When('I click the Share button', () => {
  cy.get(placeSelectors.shareBtn).click();
});

When('I click the QR Code share option', () => {
  cy.get(placeSelectors.qrCodeOption).click();
});

When('I click the Copy URL option', () => {
  cy.get(placeSelectors.copyUrlBtn).click();
});

// ─── Then — Favorites ─────────────────────────────────────────────────────────

Then('the favorites button should be active', () => {
  cy.get(placeSelectors.favoritesActive).should('exist');
});

Then('the favorites button should be inactive', () => {
  cy.get(placeSelectors.favoritesInactive).should('exist');
});

// ─── Then — Visited ───────────────────────────────────────────────────────────

Then('the visited button should be active', () => {
  cy.get(placeSelectors.visitBtnActive).should('exist');
});

Then('the visited button should be inactive', () => {
  cy.get(placeSelectors.visitBtnInactive).should('exist');
});

// ─── Then — Review ────────────────────────────────────────────────────────────

Then('the review should be displayed', () => {
  cy.get(placeSelectors.reviewDisplay).should('be.visible');
});

Then('the review input area should be visible', () => {
  cy.get(placeSelectors.reviewInputArea).should('be.visible');
});

Then('the review should not exist', () => {
  cy.get(placeSelectors.reviewDisplay).should('not.exist');
});

// ─── Then — Memo ──────────────────────────────────────────────────────────────

Then('the memo should be displayed', () => {
  cy.get(placeSelectors.memoDisplay).should('be.visible');
});

// ─── Then — Tags ──────────────────────────────────────────────────────────────

Then('the tag {string} should be visible', (tag: string) => {
  cy.get(placeSelectors.tagItem).contains(tag).should('be.visible');
});

Then('the tag {string} should not exist', (tag: string) => {
  cy.get(placeSelectors.tagItem).contains(tag).should('not.exist');
});

// ─── Then — Share ─────────────────────────────────────────────────────────────

Then('the share panel should be visible', () => {
  cy.get(placeSelectors.sharePanel).should('be.visible');
});

Then('the QR code image should be visible', () => {
  cy.get(placeSelectors.qrCodeImage).should('be.visible');
});
