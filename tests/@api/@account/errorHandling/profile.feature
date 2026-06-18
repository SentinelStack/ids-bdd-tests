@api @account
Feature: Profile update errors
  Profile updates validate the provided fields and require authentication.

  Scenario: An invalid email is rejected as a bad request
    Given the operator is authenticated via API
    When the operator updates the profile email to "not-an-email"
    Then the response status is 400

  Scenario: An invalid phone number is rejected as a bad request
    Given the operator is authenticated via API
    When the operator updates the profile phone to "abc"
    Then the response status is 400

  Scenario: Updating the profile without authentication is unauthorized
    When an unauthenticated client updates the profile email to "george.lupu@aegis.local"
    Then the response is unauthorized
