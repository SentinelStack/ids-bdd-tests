@api @devices
Feature: List devices error handling
  The device list is only available to authenticated operators.

  Scenario: Listing devices without authentication is unauthorized
    When the device list is requested without authentication
    Then the response status is 401
