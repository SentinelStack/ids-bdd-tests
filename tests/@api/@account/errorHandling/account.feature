@api @account
Feature: Account access errors
  Reading the account without a valid operator token is unauthorized.

  Scenario: Fetching the account without authentication is unauthorized
    When the operator account is requested without authentication
    Then the response is unauthorized
