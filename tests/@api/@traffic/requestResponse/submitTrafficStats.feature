@api @traffic
Feature: Submit traffic statistics (agent)
  The edge agent periodically ingests aggregated traffic-statistics windows
  via POST /api/traffic/stats using its X-API-Key. A well-formed window is
  accepted with 201.

  Scenario: The agent submits a valid traffic-statistics window
    When the agent submits valid traffic statistics
    Then the response status is 201
    And the response indicates success

  Scenario: An accepted traffic-statistics window carries an identifier
    When the agent submits valid traffic statistics
    Then the response status is 201
    And the traffic response carries an identifier

  Scenario: The agent submits a single-second aggregation window
    When the agent submits traffic statistics with the "windowSeconds" counter set to 1
    Then the response status is 201
    And the response indicates success
