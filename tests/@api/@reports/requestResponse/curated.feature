@api @reports
Feature: Curated reports catalog and download
  Operators can browse the catalog of pre-built curated reports and download
  any report listed in that catalog as a file attachment.

  Background:
    Given the operator is authenticated via API

  Scenario: Retrieve the curated reports catalog
    When the curated reports catalog is requested
    Then the response status is 200
    And the response indicates success
    And the report response data is a list

  Scenario: Download a curated report listed in the catalog
    When the curated reports catalog is requested
    And the first curated report name is remembered
    And the remembered curated report is downloaded
    Then the response status is 200
    And the report response carries a file attachment
    And the report response body is not empty
