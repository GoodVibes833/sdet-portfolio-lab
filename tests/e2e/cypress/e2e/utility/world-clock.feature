@utility @WHATODO-48
Feature: Utility - World Clock
  As a user
  I want to see world clock times
  So that I can compare Korean and Canadian times

  Scenario: World clock component is displayed
    Given I am on a page with the world clock
    Then the world clock should be visible

  Scenario: Korean time (KST) is shown
    Given I am on a page with the world clock
    Then the KST time should be displayed

  Scenario: Canadian local time is shown
    Given I am on a page with the world clock
    Then the Canadian local time should be displayed

  Scenario: Time updates in real time
    Given I am on a page with the world clock
    And I record the current displayed time
    When I wait 2 seconds
    Then the displayed time should have updated
