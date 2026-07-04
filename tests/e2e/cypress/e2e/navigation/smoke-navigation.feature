@navigation @WHATODO-30 @smoke @regression
Feature: Navigation - All Pages Smoke Test
  As a user
  I want all pages to load without crashing
  So that I can use the application reliably

  Scenario: Home (map) page renders without crashing
    Given I visit the "/" page
    Then the page should render without crashing

  Scenario: Explore page renders without crashing
    Given I visit the "/explore" page
    Then the page should render without crashing

  Scenario: Map page renders without crashing
    Given I visit the "/map" page
    Then the page should render without crashing

  Scenario: Tips page renders without crashing
    Given I visit the "/tips" page
    Then the page should render without crashing

  Scenario: Community page renders without crashing
    Given I visit the "/community" page
    Then the page should render without crashing

  Scenario: Missions page renders without crashing
    Given I visit the "/missions" page
    Then the page should render without crashing

  Scenario: Profile page renders without crashing
    Given I visit the "/profile" page
    Then the page should render without crashing

  Scenario: Ranking page renders without crashing
    Given I visit the "/ranking" page
    Then the page should render without crashing

  Scenario: Hidden spots page renders without crashing
    Given I visit the "/hidden" page
    Then the page should render without crashing

  Scenario: Friends page renders without crashing
    Given I visit the "/friends" page
    Then the page should render without crashing
