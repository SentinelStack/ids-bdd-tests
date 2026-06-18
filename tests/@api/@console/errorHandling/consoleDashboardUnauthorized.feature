@api @console
Feature: Console dashboard view — authorization

  The dashboard is an operator-only view and must reject anonymous callers.

  Scenario: An unauthenticated client cannot retrieve the dashboard
    When the console dashboard is requested without authentication
    Then the response is unauthorized
