@api @account
Feature: Password change errors
  Password changes validate strength, verify the current password, require 2FA
  to be enabled, and require authentication.

  Scenario: A weak new password is rejected as a bad request
    Given the operator is authenticated via API
    When the operator changes the password from "AegisSOC!2026" to "weak"
    Then the response status is 400

  Scenario: A wrong current password is rejected as a bad request
    Given the operator is authenticated via API
    When the operator changes the password from "totally-wrong-current" to "FreshPass2026"
    Then the response status is 400

  Scenario: Changing the password without authentication is unauthorized
    When an unauthenticated client changes the password from "AegisSOC!2026" to "FreshPass2026"
    Then the response is unauthorized

  @skip
  Scenario: Changing the password without 2FA enabled is a bad request
    # TODO: requires an operator account that does NOT have 2FA enabled.
    # The seeded QA operator has 2FA on, so this guard (2FA-not-enabled -> 400)
    # needs a dedicated non-2FA fixture account to exercise.
    Given the operator is authenticated via API
    When the operator changes the password from "AegisSOC!2026" to "FreshPass2026"
    Then the response status is 400
    And the response message contains "2FA"
