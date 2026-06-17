@api @forensics
Feature: Forensic packet ingestion error handling
  The forensics ingest endpoint rejects malformed payloads and unauthenticated
  callers so only well-formed, authorized packet metadata is stored.

  Scenario: Malformed forensic packet body is rejected
    When a malformed forensic packet "not-a-json-object" is ingested by the agent
    Then the response status is 400

  Scenario Outline: Forensic packet missing a required field is rejected
    Given a captured forensic packet
    And the forensic packet is missing the "<field>" field
    When the forensic packet is ingested by the agent
    Then the response status is 400

    Examples:
      | field         |
      | deviceId      |
      | protocol      |
      | sourceIp      |
      | destinationIp |

  Scenario: Forensic packet ingestion without authentication is rejected
    Given a captured forensic packet
    When the forensic packet is ingested without authentication
    Then the response status is 401
