@api @devices
Feature: Quarantine error handling

  Scenario: Quarantining an unknown device is not found
    Given the operator is authenticated via API
    When I quarantine an unknown device as the operator
    Then the response status is 404

  Scenario: Releasing an unknown device is not found
    Given the operator is authenticated via API
    When I release an unknown device as the operator
    Then the response status is 404

  Scenario: Quarantining without authentication is unauthorized
    Given a device has been registered
    When I quarantine the registered device without authentication
    Then the response status is 401
