@api @devices
Feature: Edge device heartbeat
  A registered device periodically reports CPU/RAM so the console can show it online.

  Background:
    Given a device has been registered

  Scenario: A heartbeat for a registered device is accepted
    When I send a heartbeat for the registered device
    Then the response status is 200
    And the response indicates success
