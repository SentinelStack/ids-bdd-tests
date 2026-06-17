@api @alerts
Feature: Acknowledge alerts as an operator
  As a SOC operator
  I want to acknowledge an alert
  So that the team knows it is being handled

  Background:
    Given the operator is authenticated via API

  Scenario: Operator acknowledges a freshly ingested alert
    When the agent ingests a new alert
    Then the response status is 201
    When the operator acknowledges the ingested alert
    Then the response status is 200
    And the response indicates success

  Scenario: Acknowledging a critical alert succeeds
    Given an alert payload is prepared
    And the alert field "severity" is set to "CRITICAL"
    When the agent ingests the prepared alert
    Then the response status is 201
    When the operator acknowledges the ingested alert
    Then the response status is 200
    And the response indicates success
