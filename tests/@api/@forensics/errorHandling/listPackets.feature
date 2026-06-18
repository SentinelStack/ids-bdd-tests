@api @forensics
Feature: Forensic packet listing error handling
  The operator forensics listing endpoint rejects unauthenticated access so
  captured packet metadata is never exposed without a valid operator session.

  Scenario: Listing forensic packets without authentication is rejected
    When I list the forensic packets without authentication
    Then the response is unauthorized
