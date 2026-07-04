@gamification @WHATODO-37 @localstorage
Feature: Gamification - Points and Level
  As a user
  I want to earn points and level up
  So that I feel rewarded for exploring places

  Background:
    And my localStorage is cleared

  Scenario: Current points are displayed
    Given I am on the profile page
    Then my current points should be visible

  Scenario: Current level is displayed
    Given I am on the profile page
    Then my current level should be visible

  Scenario: Marking a place as visited increases points
    Given my current points are recorded
    When I mark a place as visited
    Then my points should have increased

  Scenario: Points reaching a threshold increases level
    Given my points are just below a level threshold
    When I mark a place as visited
    Then my level should increase

  Scenario: Points and level persist after page refresh
    Given I have earned some points
    When I reload the page
    Then my points should still be displayed correctly
