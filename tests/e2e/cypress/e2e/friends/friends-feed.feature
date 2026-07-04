@friends @WHATODO-12
Feature: Friends - Friend Visit Feed
  As a logged-in user
  I want to view a friend's visit feed
  So that I can see where they have been

  Scenario: Friend visit feed page renders
    Given I am on a friend visit feed page
    Then the friend visit feed page should be visible

  Scenario: Friend visited places are shown
    Given I am on a friend visit feed page
    Then at least one visited place should be visible

  Scenario: Chat button is visible on friend feed
    Given I am on a friend visit feed page
    Then the chat button should be visible

  Scenario: Chat button navigates to chat page
    Given I am on a friend visit feed page
    When I click the chat button
    Then I should be on the chat page
