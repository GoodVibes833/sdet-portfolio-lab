@explore @WHATODO-49
Feature: Search - Autocomplete
  As a user
  I want to see autocomplete suggestions while searching
  So that I can find places faster

  Background:
    Given I am on the explore page

  Scenario: Autocomplete list appears while typing
    When I type "tor" in the search input
    Then the autocomplete suggestions should be visible

  Scenario: Autocomplete shows matching place names
    When I type "park" in the search input
    Then autocomplete suggestions should contain "park" in their names

  Scenario: Clicking an autocomplete item triggers search or navigation
    When I type "tor" in the search input
    And I click the first autocomplete suggestion
    Then the search should be applied or I should navigate to the place

  Scenario: ESC key closes autocomplete
    Given I have typed "tor" in the search input
    And the autocomplete suggestions are visible
    When I press Escape
    Then the autocomplete suggestions should not be visible

  Scenario: No autocomplete shown when no results match
    When I type "zzznoresults999" in the search input
    Then the autocomplete suggestions should not be visible
