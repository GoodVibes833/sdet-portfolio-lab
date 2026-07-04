@community @WHATODO-16 @smoke
Feature: Community - Community Page
  As a user
  I want to visit the community page
  So that I can connect with other working holiday users

  Scenario: Community page is accessible
    Given I am on the community page
    Then the community page should be visible

  Scenario: Community page renders without crashing
    Given I am on the community page
    Then no uncaught errors should appear
