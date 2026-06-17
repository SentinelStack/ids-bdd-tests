@api @devices
Feature: Register an edge device
  An edge agent registers a device using its X-API-Key and receives a generated device id.

  Scenario: A valid device registration succeeds
    Given a valid device registration payload
    When the device registration is submitted
    Then the response status is 201
    And the response indicates success
    And the response contains a device id

  Scenario: Registration accepts a device with a custom but valid IP address
    Given a valid device registration payload
    And the device registration field "ipAddress" is set to "10.0.0.42"
    When the device registration is submitted
    Then the response status is 201
    And the response contains a device id
