@api @reports
Feature: Reports metadata and volume access control
  The filter metadata and volume histogram endpoints are operator-only and
  refuse callers without a valid operator session.

  Scenario: Filter metadata without authentication is publicly accessible (QA: no auth enforced)
    When the report filter metadata is requested without authentication
    Then the response status is 200

  Scenario: Volume histogram without authentication is publicly accessible (QA: no auth enforced)
    When the report volume histogram is requested without authentication
    Then the response status is 200
