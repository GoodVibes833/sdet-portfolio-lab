@explore @smoke
Feature: Explore - Search and Filter
  As a user
  I want to search and filter places on the Explore page
  So that I can find specific places

  Background:
    Given I am on the explore page

  Scenario: Search for a place by name
    When I type "CN Tower" in the search input
    Then places matching "CN Tower" should appear in the results

  Scenario: Search returns no results for unknown place
    When I type "xyznotaplace123" in the search input
    Then the no results message should be visible

  Scenario: Clear search input
    Given I have typed "CN Tower" in the search input
    When I click the clear search button
    Then all places should be visible again

  Scenario: Filter by category
    When I click the "Cafe" category filter
    Then only Cafe places should appear in the results

  Scenario: Filter hidden spots only
    When I click the hidden spot filter
    Then only hidden spot places should appear in the results
