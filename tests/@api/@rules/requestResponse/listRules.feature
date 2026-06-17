@api @rules
Feature: List edge detection rules
  As an authenticated operator
  I want to list and filter the edge detection rules
  So that I can review what the routers are enforcing

  Background:
    Given the operator is authenticated via API

  Scenario: List all rules with default parameters
    When the rule list is requested
    Then the response status is 200
    And the response indicates success
    And the rule list payload is an array

  Scenario: Filter rules by detection category
    When the rule list is requested filtered by category "DDOS"
    Then the response status is 200
    And the response indicates success
    And every returned rule has category "DDOS"

  Scenario: Filter rules by a free-text search term
    When the rule list is requested with the search text "scan"
    Then the response status is 200
    And the response indicates success
    And the rule list payload is an array
