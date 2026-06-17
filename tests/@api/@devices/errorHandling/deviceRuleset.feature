@api @devices
Feature: Device ruleset error handling
  Ruleset requests for unknown devices or without credentials are rejected.

  Scenario: The ruleset for an unknown device is not found
    When the device ruleset is requested for an unknown device
    Then the response status is 404

  Scenario: The ruleset request without credentials is unauthorized
    Given a device is registered
    When the device ruleset is requested without credentials
    Then the response status is 401
