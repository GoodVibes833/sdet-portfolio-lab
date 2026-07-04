@map @WHATODO-22
Feature: Map - My Location Button
  As a user
  I want to use the my location button
  So that I can center the map on my current position

  Scenario: My location button is visible on the map
    Given I am on the main map page
    Then the my location button should be visible

  Scenario: My location button handles denied permissions gracefully
    Given I am on the main map page
    And geolocation permission is denied
    When I click the my location button
    Then no uncaught errors should appear
