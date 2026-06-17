@web @console
Feature: Operator login to the AEGIS IDS console

  # Note: assumes a test account with 2FA and a known TOTP secret (OPERATOR_TOTP_SECRET).
  Scenario: Successful login with password and second factor
    Given the operator opens the login page
    When the operator submits valid credentials
    And the operator submits the TOTP code
    Then the dashboard is displayed
