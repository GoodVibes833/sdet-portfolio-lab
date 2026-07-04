@pwa @WHATODO-43
Feature: PWA - Progressive Web App
  As a user
  I want the app to work as a PWA
  So that I can install it and use it offline

  Scenario: manifest.json loads correctly
    When I request the manifest file
    Then the manifest response should be 200

  Scenario: App name is defined in manifest
    When I request the manifest file
    Then the manifest should contain an app name

  Scenario: PWA icons are defined in manifest
    When I request the manifest file
    Then the manifest should contain at least one icon

  Scenario: Service Worker is registered
    Given I am on the main map page
    Then the service worker should be registered

  Scenario: Page loads within acceptable time
    Given I am on the main map page
    Then the page should load within 5 seconds
