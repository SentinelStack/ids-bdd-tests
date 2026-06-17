@api @console
Feature: Console hypermedia index

  The public API index exposes navigation links and requires no authentication.

  Scenario: The hypermedia index is returned to an operator
    Given the operator is authenticated via API
    When the console hypermedia index is requested
    Then the response status is 200
    And the console index exposes navigation links

  Scenario: The hypermedia index is publicly reachable without authentication
    When the console hypermedia index is requested without authentication
    Then the response status is 200
    And the console index exposes navigation links
