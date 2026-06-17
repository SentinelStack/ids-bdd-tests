@api @devices
Feature: Edge device ruleset
  An agent fetches its detection thresholds, authenticating by header or by query key.

  Background:
    Given a device has been registered

  Scenario: The ruleset is returned when authenticating with the API key header
    When I request the ruleset for the registered device using the API key header
    Then the response status is 200
    And the device response contains thresholds

  Scenario: The ruleset is returned when authenticating with the API key query parameter
    When I request the ruleset for the registered device using the API key query parameter
    Then the response status is 200
    And the device response contains thresholds
