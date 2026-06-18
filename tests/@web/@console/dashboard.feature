@web @console @skip
Feature: Dashboard

  Scenario: The dashboard shows the live alerts
    Given the operator opens the login page
    When the operator submits valid credentials
    And the operator submits the TOTP code
    Then the dashboard is displayed
    And the live alerts panel is visible
