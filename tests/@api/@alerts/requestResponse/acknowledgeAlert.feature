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
    When the agent ingests an alert with severity "CRITICAL" protocol "TCP" source ip "203.0.113.5"
    Then the response status is 201
    When the operator acknowledges the ingested alert
    Then the response status is 200
    And the response indicates success
