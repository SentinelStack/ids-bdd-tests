@api @devices
Feature: Device ruleset error handling

  Scenario: The ruleset without credentials is unauthorized
    Given a device has been registered
    When I request the ruleset for the registered device without credentials
    Then the response is unauthorized
