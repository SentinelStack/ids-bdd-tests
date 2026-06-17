@api @devices
Feature: Quarantine and release a device
  An operator isolates a compromised device and later restores it.

  Background:
    Given the operator is authenticated via API
    And a device has been registered

  Scenario: The operator quarantines a device
    When I quarantine the registered device as the operator
    Then the response status is 200
    And the registered device has status "QUARANTINED"

  Scenario: The operator releases a quarantined device
    When I quarantine the registered device as the operator
    And I release the registered device as the operator
    Then the response status is 200
