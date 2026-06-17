@api @account
Feature: Two-factor login (TOTP second step)
  After a 2FA challenge, the operator completes login by submitting the current
  TOTP code together with the challenge token.

  Background:
    Given the operator has started a login that requires a second factor

  Scenario: Completing the second factor with a valid TOTP code issues a token
    When the operator completes the second factor with the current TOTP code
    Then the response status is 200
    And the response indicates success
    And the mfa response carries a token
