@explore @WHATODO-27
Feature: Explore - Place Count Display
  As a user
  I want to see the number of places shown
  So that I know how many results are available

  Background:
    Given I am on the explore page

  Scenario: Place count is displayed
    Then the place count should be visible

  Scenario: Place count updates when filter is applied
    When I click the "Food" category filter
    Then the place count should reflect filtered results

  Scenario: Place count updates when search is performed
    When I type "cafe" in the search input
    Then the place count should reflect search results
