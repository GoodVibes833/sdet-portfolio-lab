@responsive @WHATODO-45
Feature: Responsive - Mobile Viewport
  As a mobile user
  I want the app to display correctly on small screens
  So that I can use it on my phone

  Background:
    Given I am using a mobile viewport

  Scenario: Main map page renders on mobile
    Given I am on the main map page
    Then the main map page should be visible without horizontal overflow

  Scenario: Navbar renders correctly on mobile
    Given I am on the main map page
    Then the navbar should be visible on mobile

  Scenario: Bottom sheet is scrollable on mobile
    Given I am on the main map page
    Then the bottom sheet should be scrollable

  Scenario: Explore page renders on mobile
    Given I am on the explore page
    Then the explore page should be visible without horizontal overflow

  Scenario: Place detail page renders on mobile
    Given I am on a place detail page
    Then the place detail page should be visible without horizontal overflow

  Scenario: Text is not clipped on mobile
    Given I am on the explore page
    Then no text content should be clipped or overflowing
