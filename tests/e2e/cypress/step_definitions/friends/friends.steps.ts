import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { friendsSelectors } from '../../support/selectors/friends/friends.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the friends page', () => {
  cy.visit('/friends');
  cy.get(friendsSelectors.friendsPage).should('be.visible');
});

Given('I am on the friends feed page for user {string}', (userId: string) => {
  cy.visit(`/friends/${userId}`);
  cy.get(friendsSelectors.feedPage).should('be.visible');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I click the Friends List tab', () => {
  cy.get(friendsSelectors.friendsListTab).click();
});

When('I click the Messages tab', () => {
  cy.get(friendsSelectors.messagesTab).click();
});

When('I click the Invitations tab', () => {
  cy.get(friendsSelectors.invitationsTab).click();
});

When('I search for a friend with {string}', (query: string) => {
  cy.get(friendsSelectors.searchInput).type(query);
});

When('I click the Add Friend button on the search result', () => {
  cy.get(friendsSelectors.addFriendBtn).first().click();
});

When('I click the Chat button on the friends feed', () => {
  cy.get(friendsSelectors.chatBtn).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the friends page should be visible', () => {
  cy.get(friendsSelectors.friendsPage).should('be.visible');
});

Then('the friends list tab should be active', () => {
  cy.get(friendsSelectors.friendsListTab).should('have.attr', 'aria-selected', 'true');
});

Then('the search result should show matching users', () => {
  cy.get(friendsSelectors.searchResultItem).should('have.length.greaterThan', 0);
});

Then('the add friend button should be visible', () => {
  cy.get(friendsSelectors.addFriendBtn).should('be.visible');
});

Then('the friends feed page should be visible', () => {
  cy.get(friendsSelectors.feedPage).should('be.visible');
});

Then('the chat button should be visible on the feed', () => {
  cy.get(friendsSelectors.chatBtn).should('be.visible');
});
