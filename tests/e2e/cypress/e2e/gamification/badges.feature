@gamification @WHATODO-38 @localstorage
Feature: Gamification - Badges
  As a user
  I want to earn and view badges
  So that I can track my achievements

  Background:
    And my localStorage is cleared

  Scenario: Badge panel is displayed
    Given I am on the profile page
    Then the badge panel should be visible

  Scenario: Earned badges are displayed
    Given I have earned the "Explorer" badge
    When I am on the profile page
    Then the "Explorer" badge should be visible

  Scenario: Unearned badges show locked state
    Given I have not earned the "Legend" badge
    When I am on the profile page
    Then the "Legend" badge should show as locked

  Scenario: Badge acquisition conditions are shown
    Given I am on the profile page
    Then badge conditions should be visible for locked badges

  Scenario: Badge is automatically awarded when condition is met
    Given I am close to earning the "Explorer" badge
    When I meet the required condition
    Then the "Explorer" badge should be awarded

  Scenario: Badge state persists after page refresh
    Given I have earned the "Explorer" badge
    When I reload the page
    Then the "Explorer" badge should still be visible
