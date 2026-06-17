@api @traffic
Feature: Read aggregated traffic (operator)
  Operators read aggregated traffic windows via GET /api/traffic. The
  endpoint requires operator authentication and supports an optional
  time range. A valid request returns 200 with a list of windows.

  Background:
    Given the operator is authenticated via API

  Scenario: The operator reads the traffic overview with default parameters
    When the operator requests the traffic overview
    Then the response status is 200
    And the response indicates success

  Scenario: The traffic overview exposes a list of windows
    When the operator requests the traffic overview
    Then the response status is 200
    And the traffic overview contains a list of windows

  Scenario: The operator reads the traffic overview for an explicit time range
    When the operator requests the traffic overview for the last 3600 seconds
    Then the response status is 200
    And the traffic overview contains a list of windows
