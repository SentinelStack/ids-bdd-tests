@api @devices
Feature: Register device error handling
  Invalid payloads and missing credentials are rejected when registering a device.

  Scenario: A blank device name is rejected
    When I register a device with the "name" field set to ""
    Then the response status is 400

  Scenario Outline: A missing mandatory field is rejected
    When I register a device with the "<field>" field omitted
    Then the response status is 400

    Examples:
      | field     |
      | name      |
      | ipAddress |

  Scenario: An invalid IP address is rejected
    When I register a device with the "ipAddress" field set to "999.999.1.1"
    Then the response status is 400

  Scenario: Registration without an API key is unauthorized
    When I register a device without an API key
    Then the response status is 401

  Scenario: Registration with an invalid API key is unauthorized
    When I register a device with an invalid API key
    Then the response status is 401
