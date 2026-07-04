@map @WHATODO-28
Feature: Map - Indoor/Outdoor Filter
  As a user
  I want to filter map places by indoor or outdoor
  So that I can find places suited to the weather

  Background:
    Given I am on the main map page

  Scenario: Indoor and Outdoor filter chips are visible
    Then the indoor filter chip should be visible
    And the outdoor filter chip should be visible

  Scenario: Indoor filter shows only indoor places
    When I click the indoor filter chip
    Then only indoor place markers should be visible

  Scenario: Outdoor filter shows only outdoor places
    When I click the outdoor filter chip
    Then only outdoor place markers should be visible

  Scenario: Clicking active indoor/outdoor filter deactivates it
    Given I have clicked the indoor filter chip
    When I click the indoor filter chip again
    Then all place markers should be visible on the map
