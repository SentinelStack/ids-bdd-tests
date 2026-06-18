@api @alerts
Feature: Reject invalid or unauthorized alert ingestion
  As the platform
  I want to reject malformed or unauthenticated alert ingestion
  So that only well-formed alerts from trusted agents are stored

  Scenario: Ingestion without authentication is rejected
    When the agent ingests an alert without authentication
    Then the response is unauthorized

  Scenario: Ingestion with an invalid API key is rejected
    When the agent ingests an alert with an invalid API key
    Then the response is unauthorized

  Scenario Outline: Ingestion with a missing mandatory field is rejected
    When the agent ingests an alert with the "<field>" field omitted
    Then the response status is 400

    Examples:
      | field    |
      | type     |
      | severity |

  Scenario Outline: Ingestion with an invalid severity enum is rejected
    When the agent ingests an alert with the "severity" field set to "<severity>"
    Then the response status is 400

    Examples:
      | severity |
      | URGENT   |
      | high     |
      | SEV1     |
      | EXTREME  |
