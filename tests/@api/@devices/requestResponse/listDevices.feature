@api @devices
Feature: List devices
  An authenticated operator can list every device known to the platform.

  Background:
    Given the operator is authenticated via API

  Scenario: The operator retrieves the device list
    Given a device is registered
    When the device list is requested by the operator
    Then the response status is 200
    And the response indicates success
    And the response contains a list of devices
