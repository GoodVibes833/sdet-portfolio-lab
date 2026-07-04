@place @WHATODO-33 @localstorage
Feature: Place - Review (리뷰 작성)
  As a user
  I want to write a review for a place
  So that I can share my experience

  Background:
    Given I am on a place detail page
    And my localStorage is cleared

  Scenario: Review input area is visible
    Then the review input area should be visible

  Scenario: Review can be written and saved
    When I type "Great place!" in the review input
    And I save the review
    Then "Great place!" should be displayed as my review

  Scenario: Saved review is displayed
    Given I have saved a review "Amazing spot"
    Then "Amazing spot" should be displayed as my review

  Scenario: Review persists after page refresh
    Given I have saved a review "Amazing spot"
    When I reload the page
    Then "Amazing spot" should still be displayed as my review

  Scenario: Review can be edited
    Given I have saved a review "Amazing spot"
    When I edit the review to "Even better!"
    Then "Even better!" should be displayed as my review

  Scenario: Review can be deleted
    Given I have saved a review "Amazing spot"
    When I delete the review
    Then the review should no longer be displayed
