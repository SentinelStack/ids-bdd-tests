@api @forensics
Feature: Forensic packet ingestion by the edge agent
  The edge agent submits captured packet metadata (no PCAP payload) to the
  forensics ingest endpoint so operators can investigate incidents.

  Scenario: Agent ingests a valid forensic packet
    Given a captured forensic packet for device "dev-router-01"
    When the forensic packet is ingested by the agent
    Then the response status is 201
    And the response indicates success

  Scenario: Agent ingests a forensic packet for a specific device
    Given a captured forensic packet for device "dev-router-77"
    When the forensic packet is ingested by the agent
    Then the response status is 201
    And the response indicates success

  Scenario: Ingested forensic packet becomes retrievable to operators
    Given the operator is authenticated via API
    And a forensic packet for device "dev-router-09" has been ingested
    When the forensic packet list is requested for device "dev-router-09"
    Then the response status is 200
    And the forensic response returns a packet collection
    And every forensic packet in the response belongs to device "dev-router-09"
