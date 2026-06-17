@api @devices
Feature: Quarantine and release a device
  An authenticated operator can quarantine a device to isolate it and later release it back online.

  Background:
    Given the operator is authenticated via API

  Scenario: The operator quarantines a registered device
    Given a device is registered
    When the registered device is quarantined by the operator
    Then the response status is 200
    And the response indicates success
    And the device status is "QUARANTINED"

  Scenario: The operator releases a quarantined device back online
    Given a device is registered
    When the registered device is quarantined by the operator
    Then the device status is "QUARANTINED"
    When the registered device is released by the operator
    Then the response status is 200
    And the device status is "ONLINE"
