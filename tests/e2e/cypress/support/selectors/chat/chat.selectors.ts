// Selectors for Chat — WHATODO-13

export const chatSelectors = {
  // Page
  chatPage: '[data-testid="chat-page"]',

  // Messages
  messageList: '[data-testid="chat-message-list"]',
  messageItem: '[data-testid="chat-message-item"]',
  sentMessage: '[data-testid="chat-message-sent"]',
  receivedMessage: '[data-testid="chat-message-received"]',
  dateSeparator: '[data-testid="chat-date-separator"]',
  readReceipt: '[data-testid="chat-read-receipt"]',

  // Input
  chatInput: '[data-testid="chat-input"]',
  sendBtn: '[data-testid="chat-send-btn"]',

  // Header
  chatHeader: '[data-testid="chat-header"]',
  chatPartnerName: '[data-testid="chat-partner-name"]',
};
