@explore @WHATODO-20
Feature: Explore - Price Filter
  As a user
  I want to filter places by price
  So that I can find free or paid places

  Background:
    Given I am on the explore page

  Scenario: Price filter chips are displayed
    Then the price filter chips should be visible

  Scenario: Free filter shows only free places
    When I click the free price filter
    Then only free places should be displayed

  Scenario: Paid filter shows only paid places
    When I click the paid price filter
    Then only paid places should be displayed

  Scenario: Clicking active price filter deactivates it
    Given I have clicked the free price filter
    When I click the free price filter again
    Then all places should be displayed
