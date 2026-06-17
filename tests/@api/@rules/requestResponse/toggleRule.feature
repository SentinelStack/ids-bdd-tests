@api @rules
Feature: Toggle an edge detection rule
  As an authenticated operator
  I want to enable or disable an existing rule
  So that I can control which detections the routers apply

  Background:
    Given the operator is authenticated via API
    And an existing rule is captured from the rule list

  Scenario: Disable a rule
    When I toggle the captured rule to enabled "false"
    Then the response status is 200
    And the response indicates success
    And the returned rule reports enabled "false"

  Scenario: Enable a rule
    When I toggle the captured rule to enabled "true"
    Then the response status is 200
    And the response indicates success
    And the returned rule reports enabled "true"

  Scenario: Flip a rule to the opposite of its current state
    When I flip the captured rule to its opposite state
    Then the response status is 200
    And the response indicates success
