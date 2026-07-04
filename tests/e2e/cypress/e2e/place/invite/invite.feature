@place @WHATODO-14 @requires-auth
Feature: Place - Friend Invite
  As a logged-in user
  I want to invite friends to a place
  So that we can plan a visit together

  Scenario: Invite button is visible for logged-in user
    Given I am logged in
    And I am on a place detail page
    Then the invite button should be visible

  Scenario: Invite modal opens on button click
    Given I am logged in
    And I am on a place detail page
    When I click the invite button
    Then the invite modal should be visible

  Scenario: Friend list is shown in invite modal
    Given I am logged in
    And I am on a place detail page
    When I click the invite button
    Then at least one friend should be listed in the invite modal

  Scenario: Google Calendar link is provided after invite
    Given I am logged in
    And I am on a place detail page
    When I click the invite button
    And I select a friend from the invite list
    And I confirm the invite
    Then a Google Calendar link should be provided
