@api @reports
Feature: Reports volume histogram
  Operators can retrieve a 24-hour histogram describing alert volume over time.

  Background:
    Given the operator is authenticated via API

  Scenario: Retrieve the 24-hour volume histogram
    When the report volume histogram is requested
    Then the response status is 200
    And the response indicates success

  Scenario: Volume histogram response carries a JSON body
    When the report volume histogram is requested
    Then the response status is 200
    And the report response content type contains "application/json"
    And the report response body is not empty
