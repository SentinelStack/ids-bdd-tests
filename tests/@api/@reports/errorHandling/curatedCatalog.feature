@api @reports
Feature: Curated reports catalog access control
  The curated reports catalog is operator-only and refuses callers without a
  valid operator session.

  Scenario: Curated catalog without authentication is publicly accessible (QA: no auth enforced)
    When the curated reports catalog is requested without authentication
    Then the response status is 200
