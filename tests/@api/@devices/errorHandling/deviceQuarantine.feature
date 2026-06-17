@api @devices
Feature: Quarantine and release error handling
  Quarantine and release actions require an operator and a known device.

  Background:
    Given the operator is authenticated via API

  Scenario: Quarantining an unknown device is not found
    When an unknown device is quarantined by the operator
    Then the response status is 404

  Scenario: Releasing an unknown device is not found
    When an unknown device is released by the operator
    Then the response status is 404

  Scenario: Quarantining a device without authentication is unauthorized
    Given a device is registered
    When the registered device is quarantined without authentication
    Then the response status is 401

  Scenario: Releasing a device without authentication is unauthorized
    Given a device is registered
    When the registered device is released without authentication
    Then the response status is 401
