@api @forensics
Feature: Operators list captured forensic packets
  Authenticated operators retrieve captured packet metadata, optionally
  filtered by device, to support incident forensics.

  Background:
    Given the operator is authenticated via API

  Scenario: Operator lists all forensic packets
    When the forensic packet list is requested
    Then the response status is 200
    And the response indicates success
    And the forensic response returns a packet collection

  Scenario: Operator filters forensic packets by device
    Given a forensic packet for device "dev-router-42" has been ingested
    When the forensic packet list is requested for device "dev-router-42"
    Then the response status is 200
    And the forensic response returns a packet collection
    And every forensic packet in the response belongs to device "dev-router-42"

  Scenario: Filtering by an unknown device returns an empty collection
    When the forensic packet list is requested for device "dev-does-not-exist"
    Then the response status is 200
    And the forensic response returns a packet collection
    And every forensic packet in the response belongs to device "dev-does-not-exist"
