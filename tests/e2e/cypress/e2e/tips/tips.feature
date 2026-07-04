@tips @WHATODO-15 @smoke
Feature: Tips - Working Holiday Tips Page
  As a user
  I want to read working holiday tips
  So that I can prepare for my trip to Canada

  Scenario: Tips page is accessible
    Given I am on the tips page
    Then the tips page should be visible

  Scenario: Tips page renders without crashing
    Given I am on the tips page
    Then no uncaught errors should appear

  Scenario: At least one tip is displayed
    Given I am on the tips page
    Then at least one tip content should be visible
