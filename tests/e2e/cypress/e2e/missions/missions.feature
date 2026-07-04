@missions @WHATODO-17 @smoke
Feature: Missions - Missions Page
  As a user
  I want to view available missions
  So that I can earn points and badges

  Scenario: Missions page is accessible
    Given I am on the missions page
    Then the missions page should be visible

  Scenario: Missions page renders without crashing
    Given I am on the missions page
    Then no uncaught errors should appear

  Scenario: At least one mission is displayed
    Given I am on the missions page
    Then at least one mission item should be visible
