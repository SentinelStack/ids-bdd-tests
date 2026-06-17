@api @devices
Feature: Device heartbeat error handling

  Scenario: A heartbeat for an unknown device is not found
    When I send a heartbeat for an unknown device
    Then the response status is 404

  Scenario: A malformed heartbeat is rejected
    Given a device has been registered
    When I send a malformed heartbeat for the registered device
    Then the response status is 400

  Scenario: A heartbeat without authentication is unauthorized
    Given a device has been registered
    When I send a heartbeat for the registered device without authentication
    Then the response status is 401
