@api @alerts
Feature: Reject invalid or unauthorized alert listing
  As the platform
  I want to reject unauthenticated or malformed list requests
  So that the alert query surface stays safe and predictable

  Scenario: Listing without authentication is rejected
    When an unauthenticated operator requests the alert list
    Then the response status is 401

  Scenario Outline: Listing with an invalid sort field is rejected
    Given the operator is authenticated via API
    When the operator requests the alert list with query "?sort=<field>"
    Then the response status is 400

    Examples:
      | field           |
      | bogusColumn     |
      | severity;drop   |
      | ../../etc       |

  Scenario Outline: Listing with an invalid timestamp filter is rejected
    Given the operator is authenticated via API
    When the operator requests the alert list with query "?from=<timestamp>"
    Then the response status is 400

    Examples:
      | timestamp           |
      | not-a-date          |
      | 2026-13-40T99:99:99 |
      | yesterday           |
