@api @traffic
Feature: Read aggregated traffic error handling (operator)
  Unauthenticated reads of GET /api/traffic/summary are rejected rather than
  returning aggregated traffic.

  Scenario: Reading the traffic summary without authentication is unauthorized
    When the operator requests the traffic summary without authentication
    Then the response is unauthorized
