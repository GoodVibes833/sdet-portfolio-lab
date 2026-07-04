@auth @WHATODO-24 @requires-auth
Feature: Auth - Logged-in State UI
  As a logged-in user
  I want to see my avatar in the navbar
  So that I can confirm I am logged in

  Scenario: User avatar is shown after login
    Given I am logged in
    When I am on the main map page
    Then the user avatar should be displayed in the navbar

  Scenario: Login button is hidden after login
    Given I am logged in
    When I am on the main map page
    Then the navbar login button should not be visible

  Scenario: Avatar click navigates to profile
    Given I am logged in
    And I am on the main map page
    When I click the user avatar
    Then I should be on the profile page
