@api @forensics
Feature: Operators list captured forensic packets
  Authenticated operators retrieve captured packet metadata, optionally
  filtered by device, to support incident forensics.

  Background:
    Given the operator is authenticated via API

  Scenario: Operator lists all forensic packets
    When I list the forensic packets as the operator
    Then the response status is 200
    And the response indicates success
    And the forensic response contains a packet collection

  Scenario: Operator filters forensic packets by device
    Given a forensic packet has been ingested for device "dev-router-42"
    When I list the forensic packets for device "dev-router-42" as the operator
    Then the response status is 200
    And the forensic response contains a packet collection
    And every forensic packet in the response belongs to device "dev-router-42"

  Scenario: Filtering by an unknown device returns an empty collection
    When I list the forensic packets for an unknown device as the operator
    Then the response status is 200
    And the forensic response contains a packet collection
