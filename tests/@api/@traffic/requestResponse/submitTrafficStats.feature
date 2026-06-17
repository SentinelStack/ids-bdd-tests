@api @traffic
Feature: Submit traffic statistics (agent)
  The edge agent periodically ingests aggregated traffic-statistics windows
  via POST /api/traffic/stats. A well-formed window is accepted with 201.

  Scenario: The agent submits a valid traffic-statistics window
    When the agent submits valid traffic statistics
    Then the response status is 201
    And the response indicates success

  Scenario: An accepted traffic-statistics window is echoed with an identifier
    When the agent submits valid traffic statistics
    Then the response status is 201
    And the accepted traffic statistics carry an identifier
