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

  Scenario: A previously requested dashboard can be requested again under an alias
    Given the console dashboard has been requested as console2
    When the console dashboard is requested as console2
    Then the response status is 200
    And the response indicates success
