@map @smoke
Feature: Map - City Tab Navigation
  As a user
  I want to switch between city tabs on the map
  So that I can explore places in different cities

  Background:
    Given I am on the main map page

  Scenario: Default city is Toronto
    Then the "Toronto" city tab should be active
    And the map should be centered on Toronto

  Scenario: Switch to Vancouver
    When I click the "Vancouver" city tab
    Then the "Vancouver" city tab should be active
    And the map should show Vancouver places

  Scenario: Switch between multiple cities
    When I click the "Vancouver" city tab
    And I click the "Calgary" city tab
    Then the "Calgary" city tab should be active
