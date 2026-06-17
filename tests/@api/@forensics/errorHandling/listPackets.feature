@api @forensics
Feature: Forensic packet listing error handling
  The operator forensics listing endpoint rejects unauthenticated access so
  captured packet metadata is never exposed without a valid operator session.

  Scenario: Listing forensic packets without authentication is rejected
    When the forensic packet list is requested without authentication
    Then the response status is 401

  Scenario: Filtering forensic packets without authentication is rejected
    When the forensic packet list is requested for device "dev-router-01" without authentication
    Then the response status is 401
