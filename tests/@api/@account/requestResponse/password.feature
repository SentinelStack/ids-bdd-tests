@api @account
Feature: Operator password change
  An authenticated operator with 2FA enabled can change their password by
  supplying the correct current password and a strong new one.

  Background:
    Given the operator is authenticated via API

  Scenario: Changing the password with valid credentials succeeds
    When the operator rotates the password and restores it
    Then the response status is 200
    And the response indicates success
