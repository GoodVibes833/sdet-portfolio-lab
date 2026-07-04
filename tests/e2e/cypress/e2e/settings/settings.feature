@settings @WHATODO-42
Feature: Settings - Settings Panel
  As a user
  I want to configure app settings
  So that I can personalise my experience

  Scenario: Settings panel can be opened
    Given I am on the main map page
    When I open the settings panel
    Then the settings panel should be visible

  Scenario: Font size setting is shown
    Given the settings panel is open
    Then the font size setting should be visible

  Scenario: Font size change is applied immediately
    Given the settings panel is open
    When I change the font size setting
    Then the font size on the page should change

  Scenario: High contrast toggle is shown
    Given the settings panel is open
    Then the high contrast toggle should be visible

  Scenario: High contrast mode can be toggled on
    Given the settings panel is open
    When I toggle high contrast mode on
    Then the high contrast class should be applied to the page

  Scenario: Settings persist after page refresh
    Given I have changed the font size setting
    When I reload the page
    Then the font size setting should still be applied
