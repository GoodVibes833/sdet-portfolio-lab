@collections @WHATODO-36 @localstorage
Feature: Collections - Collection Manager
  As a user
  I want to manage place collections
  So that I can group places I want to visit

  Background:
    And my localStorage is cleared

  Scenario: A new collection can be created
    Given I am on the collections page
    When I create a new collection named "Summer Spots"
    Then "Summer Spots" should appear in the collection list

  Scenario: Collection list is displayed
    Given I have a collection named "Weekend Plans"
    When I am on the collections page
    Then "Weekend Plans" should be visible in the collection list

  Scenario: A place can be added to a collection
    Given I have a collection named "Summer Spots"
    And I am on a place detail page
    When I add the place to the "Summer Spots" collection
    Then the place should appear in the "Summer Spots" collection

  Scenario: Places in a collection are listed
    Given I have a collection with a place added
    When I open that collection
    Then the place should be visible in the collection

  Scenario: A place can be removed from a collection
    Given I have a collection with a place added
    When I remove the place from the collection
    Then the place should not appear in the collection

  Scenario: A collection can be deleted
    Given I have a collection named "Old List"
    When I delete the "Old List" collection
    Then "Old List" should not appear in the collection list

  Scenario: Collections persist after page refresh
    Given I have a collection named "My Favourites"
    When I reload the page
    Then "My Favourites" should still be visible in the collection list
