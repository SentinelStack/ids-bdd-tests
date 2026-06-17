@api @devices
Feature: List devices in the console
  An authenticated operator lists the registered devices.

  Background:
    Given the operator is authenticated via API
    And a device has been registered

  Scenario: The operator retrieves the device list
    When I list the devices as the operator
    Then the response status is 200
    And the device response contains a list of devices
