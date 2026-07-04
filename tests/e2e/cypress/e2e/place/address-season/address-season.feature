@place @WHATODO-21
Feature: Place - Address and Best Season Display
  As a user
  I want to see address and best season information
  So that I can plan my visit accordingly

  Scenario: Place address is displayed on detail page
    Given I am on a place detail page
    Then the place address should be visible

  Scenario: Best season badge is displayed on detail page
    Given I am on a place detail page with a best season
    Then the best season badge should be visible

  Scenario: Source links section is displayed
    Given I am on a place detail page with source links
    Then the source links section should be visible
