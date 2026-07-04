@chat @WHATODO-13 @requires-supabase
Feature: Chat - 1:1 Realtime Chat
  As a logged-in user
  I want to chat with a friend
  So that I can communicate in real time

  Scenario: Chat page renders
    Given I am on a chat page
    Then the chat page should be visible

  Scenario: Chat input is available
    Given I am on a chat page
    Then the chat input should be visible

  Scenario: Sending a message via Enter key
    Given I am on a chat page
    When I type "Hello" in the chat input
    And I press Enter
    Then the message "Hello" should appear in the chat

  Scenario: Date separator is shown
    Given I am on a chat page with messages from multiple days
    Then a date separator should be visible

  Scenario: Read receipts are shown
    Given I am on a chat page with sent messages
    Then the read receipt should be visible on sent messages
