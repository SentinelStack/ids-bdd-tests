@api @devices
Feature: Fetch a device ruleset
  A device's detection thresholds can be fetched with an API key header, an apiKey query
  parameter, or an operator bearer token.

  Scenario: The ruleset is returned when using the API key header
    Given a device is registered
    When the device ruleset is requested with the API key header
    Then the response status is 200
    And the response indicates success
    And the response contains device thresholds

  Scenario: The ruleset is returned when using the apiKey query parameter
    Given a device is registered
    When the device ruleset is requested with the API key query parameter
    Then the response status is 200
    And the response contains device thresholds
