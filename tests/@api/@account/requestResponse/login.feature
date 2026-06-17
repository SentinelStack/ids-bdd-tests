@api @account
Feature: Operator login
  An operator authenticates with username and password and receives either a
  JWT token or a short-lived 2FA challenge.

  Scenario: Logging in with the seeded operator credentials succeeds
    When the operator logs in with the seeded credentials
    Then the response status is 200
    And the response indicates success
    And the login response carries a token or a 2FA challenge

  Scenario: A 2FA-protected account is challenged for a second factor
    When the operator logs in with the seeded credentials
    Then the response status is 200
    And the login response requires a second factor
