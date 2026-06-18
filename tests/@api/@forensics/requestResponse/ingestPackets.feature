@api @forensics
Feature: Forensic packet ingestion by the edge agent
  The edge agent submits captured packet metadata (no PCAP payload) to the
  forensics ingest endpoint so operators can investigate incidents.

  Scenario: Agent ingests a valid forensic packet
    When I ingest a forensic packet
    Then the response status is 201
    And the response indicates success
    And the forensic response contains the stored packet

  Scenario: Agent ingests a forensic packet for a specific device
    When I ingest a forensic packet for device "dev-router-77"
    Then the response status is 201
    And the response indicates success
    And the forensic response contains the stored packet

  Scenario: Ingested forensic packet becomes retrievable to operators
    Given the operator is authenticated via API
    And a forensic packet has been ingested for device "dev-router-09"
    When I list the forensic packets as the operator
    Then the response status is 200
    And the forensic response contains a packet collection
