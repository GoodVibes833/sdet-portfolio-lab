@error @WHATODO-44 @regression
Feature: Error Handling - App Error States
  As a user
  I want the app to handle errors gracefully
  So that I am not left with a blank or broken screen

  Scenario: Non-existent place ID shows error page
    Given I visit "/place/non-existent-id-99999"
    Then an error or not found message should be visible

  Scenario: Non-existent route shows 404 page
    Given I visit "/this-page-does-not-exist"
    Then a 404 or not found message should be visible

  Scenario: App does not crash on network errors
    Given network requests are stubbed to fail
    When I am on the explore page
    Then no uncaught errors should appear

  Scenario: App runs without crashing when Supabase env vars are missing
    Given I am on the main map page
    Then no uncaught errors should appear

  Scenario: No unexpected console errors on smoke pages
    Given I visit the "/" page
    Then no console errors should be logged
