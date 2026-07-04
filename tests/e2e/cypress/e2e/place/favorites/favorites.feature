@place @WHATODO-31 @localstorage
Feature: Place - Favorites (찜하기)
  As a user
  I want to save places to my favorites
  So that I can quickly find them later

  Background:
    Given I am on a place detail page
    And my localStorage is cleared

  Scenario: Favorites button is visible on place detail page
    Then the favorites button should be visible

  Scenario: Clicking favorites button adds place to favorites
    When I click the favorites button
    Then the place should be added to favorites
    And the favorites button should show active state

  Scenario: Active favorites button shows filled state
    Given I have favorited the place
    Then the favorites button should show active state

  Scenario: Clicking active favorites button removes from favorites
    Given I have favorited the place
    When I click the favorites button
    Then the place should be removed from favorites
    And the favorites button should show inactive state

  Scenario: Favorites state persists after page refresh
    Given I have favorited the place
    When I reload the page
    Then the favorites button should still show active state

  Scenario: Favorites status is shown on explore place cards
    Given I have favorited a place
    When I am on the explore page
    Then the favorited place card should show active favorites state
