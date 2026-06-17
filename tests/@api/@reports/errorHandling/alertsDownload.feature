@api @reports
Feature: Alerts report download validation
  The download endpoint rejects malformed date filters with a 400 before
  attempting to stream a file.

  Background:
    Given the operator is authenticated via API

  Scenario Outline: Download rejects an invalid date filter
    When the alerts report download is requested with query "<query>"
    Then the response status is 400

    Examples:
      | query                                  |
      | ?format=csv&from=not-a-date            |
      | ?format=json&to=2026-99-99             |
      | ?format=csv&from=yesterday             |
