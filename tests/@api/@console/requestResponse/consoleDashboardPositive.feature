@api @console
Feature: Console dashboard view

  Background:
    Given the operator is authenticated via API

  Scenario: The operator retrieves the dashboard view
    When the console dashboard is requested
    Then the response status is 200
    And the response indicates success

  Scenario: The dashboard view returns a data payload
    When the console dashboard is requested
    Then the response status is 200
    And the console dashboard payload is present
