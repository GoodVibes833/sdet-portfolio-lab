@map @WHATODO-18
Feature: Map Legacy - List-style Map Page
  As a user
  I want to view the legacy map page
  So that I can see places in a list-style map view

  Scenario: Legacy map page is accessible
    Given I am on the legacy map page
    Then the legacy map page should be visible

  Scenario: Legacy map page renders without crashing
    Given I am on the legacy map page
    Then no uncaught errors should appear

  Scenario: Map markers are displayed
    Given I am on the legacy map page
    Then at least one map marker should be visible

  Scenario: Selecting a place shows detail info
    Given I am on the legacy map page
    When I click on a map marker
    Then the place detail info should be visible
