@navbar @WHATODO-06 @smoke
Feature: Navbar - Navigation and Links
  As a user
  I want to use the navigation bar
  So that I can move between pages

  Scenario: Navbar is visible on the main map page
    Given I am on the main map page
    Then the navbar should be visible

  Scenario: Login button is shown for guest users
    Given I am on the main map page as a guest
    Then the navbar login button should be visible

  Scenario: Logo navigates to home
    Given I am on the explore page
    When I click the navbar logo
    Then I should be on the main map page

  Scenario: Ranking link navigates to ranking page
    Given I am on the main map page
    When I click the ranking link in the navbar
    Then I should be on the ranking page

  Scenario: Friends link navigates to friends page
    Given I am on the main map page
    When I click the friends link in the navbar
    Then I should be on the friends page

  Scenario: Explore link navigates to explore page
    Given I am on the main map page
    When I click the explore link in the navbar
    Then I should be on the explore page
