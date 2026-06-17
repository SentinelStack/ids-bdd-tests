@api @alerts
Feature: Ingest alerts from the edge agent
  As the OpenWrt edge agent
  I want to push detected alerts to the platform using my X-API-Key
  So that operators can triage them in the console

  Scenario: Agent ingests a valid alert
    When the agent ingests a new alert
    Then the response status is 201
    And the response indicates success
    And the alert response contains an alert id

  Scenario Outline: Agent ingests alerts of varying severity
    When the agent ingests an alert with severity "<severity>" protocol "TCP" source ip "203.0.113.5"
    Then the response status is 201
    And the alert response contains an alert id

    Examples:
      | severity |
      | LOW      |
      | MEDIUM   |
      | HIGH     |
      | CRITICAL |

  Scenario: Ingested alert is returned to operators
    Given the operator is authenticated via API
    When the agent ingests a new alert
    Then the response status is 201
    When the operator lists the alerts
    Then the response status is 200
    And the alert list response is paged
