@guide @WHATODO-50
Feature: Guide - Guide Panel (도움말)
  As a user
  I want to access the guide panel
  So that I can learn how to use the app features

  Scenario: Guide button is visible
    Given I am on the main map page
    Then the guide button should be visible

  Scenario: Guide panel opens on button click
    Given I am on the main map page
    When I click the guide button
    Then the guide panel should be visible

  Scenario: Guide panel shows usage instructions
    Given the guide panel is open
    Then at least one instruction item should be visible

  Scenario: Guide panel can be closed
    Given the guide panel is open
    When I close the guide panel
    Then the guide panel should not be visible
