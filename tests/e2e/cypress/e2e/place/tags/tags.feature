@place @WHATODO-35 @localstorage
Feature: Place - Tags (태그)
  As a user
  I want to add tags to a place
  So that I can categorize places my own way

  Background:
    Given I am on a place detail page
    And my localStorage is cleared

  Scenario: Tag input area is visible
    Then the tag input area should be visible

  Scenario: A tag can be added
    When I add the tag "must-visit"
    Then the tag "must-visit" should be displayed

  Scenario: Added tags are displayed
    Given I have added the tag "budget-friendly"
    Then the tag "budget-friendly" should be displayed

  Scenario: Tags persist after page refresh
    Given I have added the tag "budget-friendly"
    When I reload the page
    Then the tag "budget-friendly" should still be displayed

  Scenario: A tag can be deleted
    Given I have added the tag "budget-friendly"
    When I delete the tag "budget-friendly"
    Then the tag "budget-friendly" should not be displayed

  Scenario: Multiple tags can be added
    When I add the tag "must-visit"
    And I add the tag "pet-friendly"
    Then both tags should be displayed
