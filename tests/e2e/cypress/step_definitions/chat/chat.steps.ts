import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { chatSelectors } from '../../support/selectors/chat/chat.selectors';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('I am on the chat page with user {string}', (userId: string) => {
  cy.visit(`/friends/chat/${userId}`);
  cy.get(chatSelectors.chatPage).should('be.visible');
});

// ─── When ────────────────────────────────────────────────────────────────────

When('I type {string} in the chat input', (message: string) => {
  cy.get(chatSelectors.chatInput).type(message);
});

When('I press Enter to send the message', () => {
  cy.get(chatSelectors.chatInput).type('{enter}');
});

When('I click the send button', () => {
  cy.get(chatSelectors.sendBtn).click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('the chat page should be visible', () => {
  cy.get(chatSelectors.chatPage).should('be.visible');
});

Then('the message list should be visible', () => {
  cy.get(chatSelectors.messageList).should('be.visible');
});

Then('the message should appear in the chat', () => {
  cy.get(chatSelectors.messageItem).last().should('be.visible');
});

Then('a date separator should be displayed', () => {
  cy.get(chatSelectors.dateSeparator).should('be.visible');
});

Then('the read receipt should be displayed', () => {
  cy.get(chatSelectors.readReceipt).should('be.visible');
});
