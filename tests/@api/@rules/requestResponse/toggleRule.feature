@api @rules
Feature: Toggle an edge detection rule
  As an authenticated operator
  I want to enable or disable an existing rule
  So that I can control which detections the routers apply

  Background:
    Given the operator is authenticated via API
    And an existing rule id is captured from the rule list

  Scenario: Disable a rule
    When the captured rule is toggled to enabled "false"
    Then the response status is 200
    And the response indicates success
    And the returned rule reports enabled "false"

  Scenario: Enable a rule
    When the captured rule is toggled to enabled "true"
    Then the response status is 200
    And the response indicates success
    And the returned rule reports enabled "true"

  Scenario: Flip a rule to the opposite of its current state
    When the captured rule enabled flag is flipped
    Then the response status is 200
    And the response indicates success
