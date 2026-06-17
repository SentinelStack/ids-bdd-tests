@api @traffic
Feature: Read aggregated traffic error handling (operator)
  Unauthenticated or malformed reads of GET /api/traffic are rejected
  rather than returning aggregated traffic.

  Scenario: Reading the traffic overview without authentication is unauthorized
    When the operator requests the traffic overview without authentication
    Then the response status is 401

  Scenario Outline: Reading the traffic overview with an invalid time range is rejected
    Given the operator is authenticated via API
    When the operator requests the traffic overview with the time range "<range>"
    Then the response status is 400

    Examples:
      | range                                              |
      | ?from=not-a-date&to=also-not-a-date                |
      | ?from=2026-06-18T00:00:00Z&to=2026-06-01T00:00:00Z |
      | ?from=2026-13-40T99:99:99Z                         |
