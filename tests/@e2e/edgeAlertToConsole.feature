@e2e
Feature: End-to-end flow - an edge alert reaches the console

  Background:
    Given the operator is authenticated via API

  Scenario: An anomaly reported by the agent appears in the console
    When the agent reports an anomaly
    Then the alert appears in the console within 20 seconds
