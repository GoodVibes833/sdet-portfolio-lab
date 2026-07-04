@map @smoke
Feature: Map - Place Filter by Category
  As a user
  I want to filter places by category on the map
  So that I can find relevant places quickly

  Background:
    Given I am on the main map page

  Scenario: Filter places by Food category
    When I click the "Food" filter chip
    Then only Food category markers should be visible on the map
    And the bottom sheet should show Food places only

  Scenario: Filter places by Outdoor category
    When I click the "Outdoor" filter chip
    Then only Outdoor category markers should be visible on the map

  Scenario: Clear filter to show all places
    Given I have selected the "Food" filter chip
    When I click the "Food" filter chip again
    Then all place markers should be visible on the map

  Scenario: Filter by multiple categories
    When I click the "Food" filter chip
    And I click the "Cafe" filter chip
    Then places from both Food and Cafe categories should be visible
