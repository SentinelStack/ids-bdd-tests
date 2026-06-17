@api @rules
Feature: Toggling rules error handling
  As the rules API
  I want to reject invalid toggle requests
  So that detection configuration stays consistent and protected

  Scenario: Toggling an unknown rule id returns not found
    Given the operator is authenticated via API
    When rule "EDGE-RULE-DOES-NOT-EXIST-999" is toggled to enabled "false"
    Then the response status is 404

  Scenario Outline: Toggling a rule with an invalid body is rejected
    Given the operator is authenticated via API
    And an existing rule id is captured from the rule list
    When the captured rule is updated with the body "<body>"
    Then the response status is 400

    Examples:
      | body                |
      | {"enabled":"yes"}   |
      | {"enabled":null}    |
      | {}                  |

  Scenario: Toggling a rule without authentication is rejected
    When rule "EDGE-RULE-DDOS-UDP-001" is toggled without authentication
    Then the response status is 401
