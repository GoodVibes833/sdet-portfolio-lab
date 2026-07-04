@explore @WHATODO-19 @smoke
Feature: Explore - City Tab Switching
  As a user
  I want to switch city tabs on the explore page
  So that I can browse places in different cities

  Background:
    Given I am on the explore page

  Scenario: City tabs are displayed
    Then the city tabs should be visible on the explore page

  Scenario: Default city tab is active
    Then the default city tab should be active

  Scenario: Switching city tab shows places for that city
    When I click the "Vancouver" city tab on the explore page
    Then Vancouver places should be displayed

  Scenario: Place list updates when city tab is switched
    Given the Toronto places are displayed
    When I click the "Calgary" city tab on the explore page
    Then the place list should update to Calgary places

  Scenario: Search and filters reset when city tab is switched
    Given I have typed "park" in the search input
    When I click the "Vancouver" city tab on the explore page
    Then the search input should be cleared
