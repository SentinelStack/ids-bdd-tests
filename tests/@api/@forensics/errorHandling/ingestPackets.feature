@api @forensics
Feature: Forensic packet ingestion error handling
  The forensics ingest endpoint rejects malformed payloads and unauthorized
  callers so only well-formed, authenticated packet metadata is stored.

  Scenario: A malformed forensic packet body is rejected
    When I ingest a malformed forensic packet
    Then the response status is 400

  Scenario Outline: A forensic packet missing a required field is rejected
    When I ingest a forensic packet with the "<field>" field omitted
    Then the response status is 400

    Examples:
      | field         |
      | deviceId      |
      | protocol      |
      | sourceIp      |
      | destinationIp |

  Scenario: Ingestion without an API key is unauthorized
    When I ingest a forensic packet without an API key
    Then the response status is 401

  Scenario: Ingestion with an invalid API key is unauthorized
    When I ingest a forensic packet with an invalid API key
    Then the response status is 401
