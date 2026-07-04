@profile @WHATODO-10
Feature: Profile - Profile Page
  As a user
  I want to access the profile page
  So that I can manage my account information

  Scenario: Profile page is accessible
    Given I am on the profile page
    Then the profile page should be visible

  Scenario: Profile page renders without crashing
    Given I am on the profile page
    Then no uncaught errors should appear

  Scenario: Guest user sees login prompt on profile page
    Given I am on the profile page as a guest
    Then the login prompt should be visible
