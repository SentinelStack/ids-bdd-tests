@api @devices
Feature: Register an edge device
  An edge agent registers a router using its X-API-Key and receives a generated device id.

  Scenario: A valid device registration succeeds
    When I register a new device
    Then the response status is 201
    And the response indicates success
    And the device response contains a device id

  Scenario: Registration accepts a custom valid IP address
    When I register a device with the "ipAddress" field set to "10.0.0.42"
    Then the response status is 201
    And the device response contains a device id
