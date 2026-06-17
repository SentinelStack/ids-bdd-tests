@api @alerts
Feature: Reject invalid or unauthorized alert ingestion
  As the platform
  I want to reject malformed or unauthenticated alert ingestion
  So that only well-formed alerts from trusted agents are stored

  Scenario: Ingestion without authentication is rejected
    When an unauthenticated agent ingests a valid alert
    Then the response status is 401

  Scenario: Ingestion with a missing type is rejected
    Given an alert payload is prepared
    And the alert field "type" is omitted
    When the agent ingests the prepared alert
    Then the response status is 400

  Scenario: Ingestion with a missing severity is rejected
    Given an alert payload is prepared
    And the alert field "severity" is omitted
    When the agent ingests the prepared alert
    Then the response status is 400

  Scenario Outline: Ingestion with an invalid severity enum is rejected
    Given an alert payload is prepared
    And the alert field "severity" is set to "<severity>"
    When the agent ingests the prepared alert
    Then the response status is 400

    Examples:
      | severity  |
      | URGENT    |
      | high      |
      | SEV1      |
      | EXTREME   |
