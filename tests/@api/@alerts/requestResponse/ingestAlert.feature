@api @alerts
Feature: Ingest alerts from the edge agent
  As the OpenWrt edge agent
  I want to push detected alerts to the platform
  So that operators can triage them in the console

  Scenario: Agent ingests a valid alert
    Given an alert payload is prepared
    When the agent ingests the prepared alert
    Then the response status is 201
    And the response indicates success
    And the response contains an alert id

  Scenario: Ingested alert is returned to operators
    Given the operator is authenticated via API
    And an alert payload is prepared
    When the agent ingests the prepared alert
    Then the response status is 201
    When the operator requests the alert list
    Then the response status is 200
    And the alert list response is paged

  Scenario Outline: Agent ingests alerts of varying severity
    Given an alert payload is prepared
    And the alert field "severity" is set to "<severity>"
    When the agent ingests the prepared alert
    Then the response status is 201
    And the response contains an alert id

    Examples:
      | severity |
      | LOW      |
      | MEDIUM   |
      | HIGH     |
      | CRITICAL |
