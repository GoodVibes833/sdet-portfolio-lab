@place @WHATODO-34 @localstorage
Feature: Place - Memo (메모)
  As a user
  I want to write a personal memo for a place
  So that I can remember private notes

  Background:
    Given I am on a place detail page
    And my localStorage is cleared

  Scenario: Memo input area is visible
    Then the memo input area should be visible

  Scenario: Memo can be written and saved
    When I type "Bring a jacket!" in the memo input
    And I save the memo
    Then "Bring a jacket!" should be displayed as my memo

  Scenario: Saved memo is displayed
    Given I have saved a memo "Check opening hours"
    Then "Check opening hours" should be displayed as my memo

  Scenario: Memo persists after page refresh
    Given I have saved a memo "Check opening hours"
    When I reload the page
    Then "Check opening hours" should still be displayed as my memo

  Scenario: Memo can be edited
    Given I have saved a memo "Check opening hours"
    When I edit the memo to "Open 9am-5pm"
    Then "Open 9am-5pm" should be displayed as my memo
