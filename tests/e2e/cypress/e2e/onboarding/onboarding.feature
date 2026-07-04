@onboarding @WHATODO-41 @localstorage
Feature: Onboarding - New User Tour
  As a new user
  I want to be shown a welcome tour
  So that I can learn how to use the app

  Background:
    And my localStorage is cleared

  Scenario: Onboarding tour is shown to new users
    Given I visit the app for the first time
    Then the onboarding tour should be visible

  Scenario: Onboarding tour has multiple steps
    Given the onboarding tour is visible
    Then more than one onboarding step should exist

  Scenario: Next button advances to next step
    Given the onboarding tour is visible
    When I click the next button in the tour
    Then the next onboarding step should be shown

  Scenario: Completed onboarding does not show again
    Given I have completed the onboarding tour
    When I reload the page
    Then the onboarding tour should not be visible

  Scenario: Onboarding can be skipped
    Given the onboarding tour is visible
    When I click the skip button
    Then the onboarding tour should not be visible
