@ranking @WHATODO-09 @smoke
Feature: Ranking - Leaderboard Page
  As a user
  I want to see the ranking leaderboard
  So that I can compare my activity with others

  Scenario: Ranking page is accessible
    Given I am on the ranking page
    Then the ranking page should be visible

  Scenario: Three tabs are displayed
    Given I am on the ranking page
    Then the points tab should be visible
    And the visit count tab should be visible
    And the badge tab should be visible

  Scenario: Points tab shows leaderboard
    Given I am on the ranking page
    Then the points tab should be active
    And at least one leaderboard item should be visible

  Scenario: Visit count tab shows leaderboard
    Given I am on the ranking page
    When I click the visit count tab
    Then the visit count leaderboard should be visible
    And at least one leaderboard item should be visible

  Scenario: Badge tab shows leaderboard
    Given I am on the ranking page
    When I click the badge tab
    Then the badge leaderboard should be visible
    And at least one leaderboard item should be visible

  Scenario: Demo data is shown when Supabase is not connected
    Given I am on the ranking page
    Then at least one leaderboard item should be visible
