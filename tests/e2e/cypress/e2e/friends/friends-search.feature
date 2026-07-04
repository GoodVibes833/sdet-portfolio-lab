@friends @WHATODO-26 @requires-auth
Feature: Friends - Search Friend by Username
  As a logged-in user
  I want to search for friends by username
  So that I can add them to my friend list

  Scenario: Friend search input is visible
    Given I am on the friends page
    Then the friend search input should be visible

  Scenario: Searching returns matching users
    Given I am on the friends page
    When I type a username in the friend search input
    Then matching user results should be displayed

  Scenario: No results message shown for unknown username
    Given I am on the friends page
    When I type "zzznobodyexists999" in the friend search input
    Then the no results message should be visible

  Scenario: Friend request can be sent from search results
    Given I am on the friends page
    And matching user results are displayed
    When I click the add friend button on a search result
    Then the friend request should be sent
