@place @smoke
Feature: Place - Place Detail Page
  As a user
  I want to view the detail page of a place
  So that I can get more information about it

  Background:
    Given I am on the explore page

  Scenario: Navigate to place detail page
    When I click on the first place card
    Then I should be on the place detail page
    And the place title should be visible
    And the place category should be visible

  Scenario: Place detail shows rating
    When I click on the first place card
    Then the place rating should be visible

  Scenario: Hidden spot badge is shown for hidden spots
    Given I am on a place detail page for a hidden spot
    Then the hidden spot badge should be visible

  Scenario: Official website link is clickable
    Given I am on a place detail page with an official website
    Then the official website link should be present and have a valid href
