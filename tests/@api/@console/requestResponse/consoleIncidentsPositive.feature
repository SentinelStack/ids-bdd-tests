@api @console
Feature: Console incidents view

  Background:
    Given the operator is authenticated via API

  Scenario: The operator retrieves the default incidents view
    When the console incidents view is requested
    Then the response status is 200
    And the response indicates success

  Scenario: The operator filters the incidents view by status
    When the console incidents view is requested filtered by status "OPEN"
    Then the response status is 200
    And the response indicates success

  Scenario Outline: The operator filters the incidents view by severity
    When the console incidents view is requested filtered by severity "<severity>"
    Then the response status is 200
    And the response indicates success

    Examples:
      | severity |
      | HIGH     |
      | MEDIUM   |
      | LOW      |
