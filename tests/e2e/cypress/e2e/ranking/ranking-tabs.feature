@ranking @WHATODO-25
Feature: Ranking - Tab Switching and Content
  As a user
  I want to switch between ranking tabs
  So that I can see different leaderboard categories

  Background:
    Given I am on the ranking page

  Scenario: Tabs switch correctly
    When I click the visit count tab
    Then the visit count tab should be active
    When I click the badge tab
    Then the badge tab should be active

  Scenario: Active tab style changes on click
    When I click the badge tab
    Then the badge tab should have active styling

  Scenario: Each tab shows its content
    When I click the points tab
    Then the points leaderboard content should be visible
    When I click the visit count tab
    Then the visit count leaderboard content should be visible
    When I click the badge tab
    Then the badge leaderboard content should be visible

  Scenario: Top 3 entries are visually highlighted
    Given I am on the ranking page
    Then the top 3 entries should be visually highlighted
