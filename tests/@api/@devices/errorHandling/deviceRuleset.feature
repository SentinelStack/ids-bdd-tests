@api @devices
Feature: Device ruleset error handling

  Scenario: The ruleset for an unknown device is not found
    When I request the ruleset for an unknown device
    Then the response status is 404

  Scenario: The ruleset without credentials is unauthorized
    Given a device has been registered
    When I request the ruleset for the registered device without credentials
    Then the response status is 401
