@api @rules
Feature: List edge detection rules
  As an authenticated operator
  I want to list and filter the edge detection rules
  So that I can review what the routers are enforcing

  Background:
    Given the operator is authenticated via API

  Scenario: List all rules with default parameters
    When I list the rules as the operator
    Then the response status is 200
    And the response indicates success
    And the rules response contains a list of rules

  Scenario: Filter rules by detection category
    When I list the rules filtered by category "DDOS"
    Then the response status is 200
    And the response indicates success
    And every returned rule has category "DDOS"

  Scenario: Filter rules by a free-text search term
    When I list the rules matching the search text "scan"
    Then the response status is 200
    And the response indicates success
    And the rules response contains a list of rules
