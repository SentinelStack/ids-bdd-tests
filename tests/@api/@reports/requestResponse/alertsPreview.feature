@api @reports
Feature: Alerts report preview
  Operators can preview the first rows of an alert report before downloading
  the full export, optionally narrowing the result with filters.

  Background:
    Given the operator is authenticated via API

  Scenario: Preview alert report rows without filters
    When the alerts report preview is requested
    Then the response status is 200
    And the response indicates success
    And the report response data is a list

  Scenario: Preview alert report rows filtered by severity
    When the alerts report preview is requested with query "?severity=HIGH"
    Then the response status is 200
    And the response indicates success
    And the report response data is a list

  Scenario: Preview alert report rows within a valid date range
    When the alerts report preview is requested with query "?from=2026-01-01&to=2026-12-31"
    Then the response status is 200
    And the response indicates success
