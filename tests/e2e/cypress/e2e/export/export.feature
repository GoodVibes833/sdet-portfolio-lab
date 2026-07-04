@export @WHATODO-47
Feature: Export - CSV and Print
  As a user
  I want to export my place data
  So that I can use it outside the app

  Scenario: CSV export button is visible
    Given I am on the export page
    Then the CSV export button should be visible

  Scenario: CSV export button triggers file download
    Given I am on the export page
    When I click the CSV export button
    Then a file download should be triggered

  Scenario: Print button is visible
    Given I am on the export page
    Then the print button should be visible

  Scenario: Print button triggers print dialog
    Given I am on the export page
    When I click the print button
    Then the print function should be called
