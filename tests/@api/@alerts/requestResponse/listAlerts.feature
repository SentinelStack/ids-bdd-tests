@api @alerts
Feature: List and filter alerts as an operator
  As a SOC operator
  I want to list, filter, search and paginate alerts
  So that I can focus on the incidents that matter

  Background:
    Given the operator is authenticated via API

  Scenario: Operator lists alerts with default paging
    When the operator requests the alert list
    Then the response status is 200
    And the response indicates success
    And the alert list response is paged

  Scenario: Operator filters alerts by severity
    When the agent ingests an alert with severity "CRITICAL" protocol "TCP" source ip "203.0.113.5"
    Then the response status is 201
    When the operator requests the alert list with query "?severity=CRITICAL"
    Then the response status is 200
    And every listed alert has "severity" equal to "CRITICAL"

  Scenario: Operator filters alerts by protocol
    When the agent ingests an alert with severity "HIGH" protocol "UDP" source ip "203.0.113.9"
    Then the response status is 201
    When the operator requests the alert list with query "?protocol=UDP"
    Then the response status is 200
    And every listed alert has "protocol" equal to "UDP"

  Scenario: Operator filters alerts by source ip
    When the agent ingests an alert with severity "MEDIUM" protocol "TCP" source ip "203.0.113.42"
    Then the response status is 201
    When the operator requests the alert list with query "?sourceIp=203.0.113.42"
    Then the response status is 200
    And every listed alert has "sourceIp" equal to "203.0.113.42"

  Scenario: Operator runs a free-text search over alerts
    When the agent ingests a new alert
    Then the response status is 201
    When the operator requests the alert list with query "?search=port%20scan"
    Then the response status is 200
    And the alert list response is paged

  Scenario: Operator paginates the alert list
    When the operator requests the alert list with query "?page=0&size=5"
    Then the response status is 200
    And the alert list response is paged
    And the alert page holds at most 5 items
