@api @alerts
Feature: Reject invalid or unauthorized alert acknowledgement
  As the platform
  I want to reject acknowledgements for unknown alerts or unauthenticated callers
  So that the acknowledgement workflow stays trustworthy

  Scenario: Acknowledging without authentication is rejected
    When an unauthenticated operator acknowledges the alert id "alr-does-not-exist"
    Then the response status is 401

  Scenario: Acknowledging an unknown alert id returns not found
    Given the operator is authenticated via API
    When the operator acknowledges the alert id "alr-00000000-unknown"
    Then the response status is 404

  Scenario Outline: Acknowledging a non-existent alert id is rejected
    Given the operator is authenticated via API
    When the operator acknowledges the alert id "<alertId>"
    Then the response status is 404

    Examples:
      | alertId              |
      | alr-deadbeef         |
      | alr-11111111-2222    |
      | does-not-exist-99    |
