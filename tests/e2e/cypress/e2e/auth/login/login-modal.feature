@auth @smoke
Feature: Auth - Login Modal
  As a guest user
  I want to be able to open the login modal
  So that I can sign in with Google

  Scenario: Login modal opens when login button is clicked
    Given I am on the main map page as a guest
    When I click the login button in the navbar
    Then the login modal should be visible
    And the Google login button should be present

  Scenario: Login modal closes when X button is clicked
    Given the login modal is open
    When I click the close button
    Then the login modal should not be visible

  Scenario: Login modal closes when clicking outside
    Given the login modal is open
    When I click outside the login modal
    Then the login modal should not be visible
