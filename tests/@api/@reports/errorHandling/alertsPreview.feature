@api @reports
Feature: Alerts report preview validation
  The preview endpoint rejects malformed filters so operators get clear
  feedback instead of a broken report, and refuses unauthenticated callers.

  Background:
    Given the operator is authenticated via API

  Scenario Outline: Preview rejects an invalid date filter
    When the alerts report preview is requested with query "<query>"
    Then the response status is 400

    Examples:
      | query                            |
      | ?from=not-a-date                 |
      | ?to=31-12-2026                   |
      | ?from=2026-13-40                 |
      | ?from=2026-12-31&to=garbage      |

  Scenario: Preview without authentication is unauthorized
    When the alerts report preview is requested without authentication
    Then the response status is 401
