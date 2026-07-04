@map @WHATODO-23
Feature: Map - Place Markers and Cluster
  As a user
  I want to see place markers on the map
  So that I can visually locate places

  Background:
    Given I am on the main map page

  Scenario: Place markers are visible on the map
    Then at least one map marker should be visible

  Scenario: Clicking a marker shows place info
    When I click on a map marker
    Then the place info popup should be visible

  Scenario: Markers cluster when zoomed out
    When I zoom out the map
    Then a marker cluster should be visible

  Scenario: Clicking a cluster zooms in
    Given a marker cluster is visible
    When I click the marker cluster
    Then the map should zoom in
