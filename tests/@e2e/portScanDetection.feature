@e2e
Feature: Port scan detection

  # In the full variant this is driven by a real Nmap scan against the monitored network;
  # here we verify the alert propagates from the edge to the console.
  Background:
    Given the operator is authenticated via API

  Scenario: A scan alert reaches the console
    When the agent reports an anomaly
    Then the alert appears in the console within 30 seconds
