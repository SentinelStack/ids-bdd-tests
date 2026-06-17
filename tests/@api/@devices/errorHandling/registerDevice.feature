@api @devices
Feature: Register device error handling
  Invalid payloads and missing credentials are rejected when registering a device.

  Scenario: A blank device name is rejected
    Given a valid device registration payload
    And the device registration field "name" is set to ""
    When the device registration is submitted
    Then the response status is 400

  Scenario Outline: A missing mandatory field is rejected
    Given a valid device registration payload
    And the device registration field "<field>" is removed
    When the device registration is submitted
    Then the response status is 400

    Examples:
      | field     |
      | name      |
      | ipAddress |

  Scenario: An invalid IP address is rejected
    Given a valid device registration payload
    And the device registration field "ipAddress" is set to "999.999.1.1"
    When the device registration is submitted
    Then the response status is 400

  Scenario: Registration without an API key is unauthorized
    When the device registration is submitted without an API key
    Then the response status is 401

  Scenario: Registration with an invalid API key is unauthorized
    When the device registration is submitted with an invalid API key
    Then the response status is 401
