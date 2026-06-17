@api @reports
Feature: Reports filter metadata
  Operators can retrieve the metadata that describes which filters are
  available when building alert reports.

  Background:
    Given the operator is authenticated via API

  Scenario: Retrieve report filter metadata
    When the report filter metadata is requested
    Then the response status is 200
    And the response indicates success

  Scenario: Filter metadata response carries a JSON body
    When the report filter metadata is requested
    Then the response status is 200
    And the report response content type contains "application/json"
    And the report response body is not empty
