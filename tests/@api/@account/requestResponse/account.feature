@api @account
Feature: Authenticated account view and profile updates
  An authenticated operator can read their account snapshot and update their
  profile fields.

  Background:
    Given the operator is authenticated via API

  Scenario: Fetching the current account returns the operator snapshot
    When the operator account is requested
    Then the response status is 200
    And the response indicates success
    And the account response carries the username and account id

  Scenario: Updating the profile full name succeeds
    When the operator updates the profile full name to "George Lupu"
    Then the response status is 200
    And the response indicates success

  Scenario: Updating the profile to a fresh random full name succeeds
    When the operator updates the profile to a fresh random full name
    Then the response status is 200
    And the response indicates success

  Scenario: Updating the profile email to a valid address succeeds
    When the operator updates the profile email to "george.lupu@aegis.local"
    Then the response status is 200
    And the response indicates success

  Scenario: Updating the profile phone to a valid number succeeds
    When the operator updates the profile phone to "+40 700 000 000"
    Then the response status is 200
    And the response indicates success
