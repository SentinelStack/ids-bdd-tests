@api @forensics
Feature: Operators list captured forensic packets
  Authenticated operators retrieve captured packet metadata as a paged
  collection to support incident forensics.

  Background:
    Given the operator is authenticated via API

  Scenario: Operator lists all forensic packets
    When I list the forensic packets as the operator
    Then the response status is 200
    And the response indicates success
    And the forensic response contains a packet collection

  Scenario: Listing forensic packets after ingestion returns a paged collection
    Given a forensic packet has been ingested for device "dev-router-42"
    When I list the forensic packets as the operator
    Then the response status is 200
    And the forensic response contains a packet collection
