@explore @WHATODO-46 @localstorage
Feature: Explore - Filter Presets
  As a user
  I want to save and load filter presets
  So that I can quickly apply my favourite filter combinations

  Background:
    Given I am on the explore page
    And my localStorage is cleared

  Scenario: Current filters can be saved as a preset
    Given I have applied the "Food" category filter
    When I save the current filters as a preset named "Food Trip"
    Then "Food Trip" should appear in the preset list

  Scenario: Saved preset list is displayed
    Given I have a saved preset named "Budget Picks"
    Then "Budget Picks" should be visible in the preset list

  Scenario: Clicking a preset applies its filters
    Given I have a saved preset named "Budget Picks" with free price filter
    When I click the "Budget Picks" preset
    Then the free price filter should be active

  Scenario: Presets persist after page refresh
    Given I have a saved preset named "Budget Picks"
    When I reload the page
    Then "Budget Picks" should still be visible in the preset list

  Scenario: A preset can be deleted
    Given I have a saved preset named "Old Preset"
    When I delete the "Old Preset" preset
    Then "Old Preset" should not appear in the preset list
