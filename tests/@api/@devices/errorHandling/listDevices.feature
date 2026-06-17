@api @devices
Feature: List devices error handling

  Scenario: Listing devices without authentication is unauthorized
    When I list the devices without authentication
    Then the response status is 401
