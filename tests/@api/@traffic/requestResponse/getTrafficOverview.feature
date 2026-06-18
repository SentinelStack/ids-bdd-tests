@api @traffic
Feature: Read aggregated traffic (operator)
  Operators read aggregated traffic via GET /api/traffic/summary and per-device
  windows via GET /api/traffic/stats/by-device/{deviceId}. Both require operator
  authentication. The summary returns aggregate counters; the by-device read
  returns a paged list of windows in data.content.

  Background:
    Given the operator is authenticated via API

  Scenario: The operator reads the traffic summary with default parameters
    When the operator requests the traffic summary
    Then the response status is 200
    And the response indicates success

  Scenario: The traffic summary exposes aggregate counters
    When the operator requests the traffic summary
    Then the response status is 200
    And the traffic summary exposes aggregate counters

  Scenario: The operator reads the traffic windows for a known device
    When a traffic-statistics window has been ingested for a known device
    And the operator requests the traffic windows for the known device
    Then the response status is 200
    And the traffic windows response contains a list of windows
