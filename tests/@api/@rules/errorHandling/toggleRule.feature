@api @rules
Feature: Toggling rules error handling
  As the rules API
  I want to reject invalid toggle requests
  So that detection configuration stays consistent and protected

  Scenario: Toggling an unknown rule id returns not found
    Given the operator is authenticated via API
    When I toggle an unknown rule to enabled "false"
    Then the response status is 404

  Scenario: Toggling a rule without authentication is rejected
    Given the operator is authenticated via API
    And an existing rule is captured from the rule list
    When I toggle the captured rule without authentication
    Then the response is unauthorized
