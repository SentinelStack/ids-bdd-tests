@api @devices
Feature: Report device heartbeats
  A registered edge device periodically reports CPU/memory health to the platform.

  Scenario: A registered device reports a valid heartbeat
    Given a device is registered
    When a heartbeat is sent for the registered device
    Then the response status is 200
    And the response indicates success
