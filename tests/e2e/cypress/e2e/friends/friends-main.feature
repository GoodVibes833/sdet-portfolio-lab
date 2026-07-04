@friends @WHATODO-11
Feature: Friends - Main Page
  As a user
  I want to manage my friends
  So that I can connect with other users

  Scenario: Friends page is accessible
    Given I am on the friends page
    Then the friends page should be visible

  Scenario: Three tabs are displayed on friends page
    Given I am on the friends page
    Then the friends list tab should be visible
    And the messages tab should be visible
    And the invitations tab should be visible

  Scenario: Friend search is available
    Given I am on the friends page
    Then the friend search input should be visible

  Scenario: Messages tab shows chat shortcuts
    Given I am on the friends page
    When I click the messages tab
    Then the messages tab content should be visible

  Scenario: Invitations tab shows pending invitations
    Given I am on the friends page
    When I click the invitations tab
    Then the invitations tab content should be visible

  Scenario: Guest user sees login prompt on friends page
    Given I am on the friends page as a guest
    Then the login prompt should be visible
