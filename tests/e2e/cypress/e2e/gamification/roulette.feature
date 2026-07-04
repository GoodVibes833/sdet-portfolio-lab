@gamification @WHATODO-39
Feature: Gamification - Roulette
  As a user
  I want to spin the roulette
  So that I can earn bonus points

  Scenario: Roulette component is displayed
    Given I am on the roulette page
    Then the roulette wheel should be visible

  Scenario: Spin button is visible
    Given I am on the roulette page
    Then the spin button should be visible

  Scenario: Spinning the roulette triggers animation
    Given I am on the roulette page
    When I click the spin button
    Then the roulette animation should start

  Scenario: Roulette result changes points
    Given my current points are recorded
    When I spin the roulette and it completes
    Then my points should have changed

  Scenario: Roulette result message is shown
    Given I am on the roulette page
    When I spin the roulette and it completes
    Then a result message should be visible
