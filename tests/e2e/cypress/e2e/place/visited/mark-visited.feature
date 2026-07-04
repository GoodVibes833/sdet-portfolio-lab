@place @WHATODO-32 @localstorage
Feature: Place - Mark Visited (방문 표시)
  As a user
  I want to mark places as visited
  So that I can track where I have been

  Background:
    Given I am on a place detail page
    And my localStorage is cleared

  Scenario: Visit button is visible on place detail page
    Then the visit button should be visible

  Scenario: Clicking visit button marks place as visited
    When I click the visit button
    Then the place should be marked as visited
    And the visit button should show active state

  Scenario: Visited state shows active button
    Given I have marked the place as visited
    Then the visit button should show active state

  Scenario: Visited state persists after page refresh
    Given I have marked the place as visited
    When I reload the page
    Then the visit button should still show active state

  Scenario: Visit includes a timestamp
    When I click the visit button
    Then a visit timestamp should be stored in localStorage

  Scenario: Clicking visited button again removes visit mark
    Given I have marked the place as visited
    When I click the visit button
    Then the place should be unmarked as visited
