@api @devices
Feature: Device heartbeat error handling
  Heartbeats for unknown devices, malformed bodies, or without auth are rejected.

  Scenario: A heartbeat for an unknown device is not found
    When a heartbeat is sent for an unknown device
    Then the response status is 404

  Scenario: A malformed heartbeat body is rejected
    Given a device is registered
    When a malformed heartbeat is sent for the registered device
    Then the response status is 400

  Scenario: A heartbeat without authentication is unauthorized
    Given a device is registered
    When a heartbeat is sent for the registered device without authentication
    Then the response status is 401
