@map @WHATODO-29
Feature: Map - Price Filter
  As a user
  I want to filter map places by price
  So that I can find free or paid places on the map

  Background:
    Given I am on the main map page

  Scenario: Price filter chips are visible on the map
    Then the free price filter chip should be visible
    And the paid price filter chip should be visible

  Scenario: Free filter shows only free place markers
    When I click the free price filter chip
    Then only free place markers should be visible

  Scenario: Paid filter shows only paid place markers
    When I click the paid price filter chip
    Then only paid place markers should be visible

  Scenario: Clicking active price filter deactivates it
    Given I have clicked the free price filter chip
    When I click the free price filter chip again
    Then all place markers should be visible on the map
