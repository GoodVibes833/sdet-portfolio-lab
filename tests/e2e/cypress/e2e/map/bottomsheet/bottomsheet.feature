@map @WHATODO-07 @smoke
Feature: Map - Bottom Sheet Place List
  As a user
  I want to see a list of places in the bottom sheet
  So that I can browse places while viewing the map

  Background:
    Given I am on the main map page

  Scenario: Bottom sheet is visible on map page
    Then the bottom sheet should be visible

  Scenario: Bottom sheet shows place cards
    Then the bottom sheet should show at least one place card

  Scenario: Place card in bottom sheet navigates to detail page
    When I click on the first place card in the bottom sheet
    Then I should be on the place detail page

  Scenario: Bottom sheet updates when filter is applied
    When I click the "Food" filter chip
    Then the bottom sheet should show Food places only

  Scenario: Bottom sheet updates when city tab is switched
    When I click the "Vancouver" city tab
    Then the bottom sheet should show Vancouver places
