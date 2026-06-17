@api @reports
Feature: Alerts report download
  Operators can download the full alert report as a file attachment in CSV or
  JSON. An unrecognised format falls back to CSV.

  Background:
    Given the operator is authenticated via API

  Scenario: Download the alert report as CSV
    When the alerts report download is requested in "csv" format
    Then the response status is 200
    And the report response carries a file attachment
    And the report response content type contains "csv"

  Scenario: Download the alert report as JSON
    When the alerts report download is requested in "json" format
    Then the response status is 200
    And the report response carries a file attachment
    And the report response content type contains "json"

  Scenario: An unknown format falls back to a CSV download
    When the alerts report download is requested in "xml" format
    Then the response status is 200
    And the report response carries a file attachment
    And the report response content type contains "csv"

  Scenario: Download the alert report within a valid date range
    When the alerts report download is requested with query "?format=csv&from=2026-01-01&to=2026-12-31"
    Then the response status is 200
    And the report response carries a file attachment
