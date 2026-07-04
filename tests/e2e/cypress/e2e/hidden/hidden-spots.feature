@hidden @WHATODO-08 @smoke
Feature: Hidden Spots - Hidden Spots Page
  As a user
  I want to browse hidden spots
  So that I can discover secret places in Canada

  Scenario: Hidden spots page is accessible
    Given I am on the hidden spots page
    Then the hidden spots page should be visible

  Scenario: Hidden spots are displayed
    Given I am on the hidden spots page
    Then at least one hidden spot place card should be visible

  Scenario: Filter hidden spots by city tab
    Given I am on the hidden spots page
    When I click the "Toronto" city tab on the hidden page
    Then only Toronto hidden spots should be visible

  Scenario: Filter hidden spots by category
    Given I am on the hidden spots page
    When I click the "Outdoor" category filter on the hidden page
    Then only Outdoor hidden spots should be visible

  Scenario: Search hidden spots by name
    Given I am on the hidden spots page
    When I type "park" in the hidden spots search input
    Then hidden spots matching "park" should be visible

  Scenario: Navigate to hidden spot detail page
    Given I am on the hidden spots page
    When I click on the first hidden spot card
    Then I should be on the place detail page
    And the hidden spot badge should be visible
