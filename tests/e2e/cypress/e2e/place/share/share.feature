@place @share @WHATODO-40
Feature: Place - Share Button
  As a user
  I want to share a place
  So that I can tell others about it

  Background:
    Given I am on a place detail page

  Scenario: Share button is visible on place detail page
    Then the share button should be visible

  Scenario: Share panel opens on button click
    When I click the share button
    Then the share panel should be visible

  Scenario: QR code option is shown in share panel
    When I click the share button
    Then the QR code option should be visible

  Scenario: QR code is rendered
    When I click the share button
    And I select the QR code option
    Then a QR code image should be rendered

  Scenario: URL copy option is shown in share panel
    When I click the share button
    Then the copy URL option should be visible

  Scenario: URL copy button copies to clipboard
    When I click the share button
    And I click the copy URL button
    Then the URL should be copied to clipboard
