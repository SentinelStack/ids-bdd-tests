@api @reports
Feature: Curated report download validation
  Requesting an unknown curated report returns a 400 whose message lists the
  available reports, helping the operator pick a valid one.

  Background:
    Given the operator is authenticated via API

  Scenario: Downloading an unknown curated report is rejected
    When the curated report "this-report-does-not-exist" is downloaded
    Then the response status is 400
    And the response message contains "available"

  Scenario: Downloading a curated report with an empty-looking name is rejected
    When the curated report "%20" is downloaded
    Then the response status is 400

  Scenario Outline: Unknown curated names are rejected with guidance
    When the curated report "<name>" is downloaded
    Then the response status is 400
    And the response message contains "available"

    Examples:
      | name              |
      | bogus             |
      | top-talkers-2099  |
