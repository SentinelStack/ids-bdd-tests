@api @console
Feature: Console incidents view — authorization

  The incidents view is an operator-only view and must reject anonymous callers.

  Scenario: An unauthenticated client cannot retrieve the incidents view
    When the console incidents view is requested without authentication
    Then the response is unauthorized

  Scenario: An unauthenticated client cannot retrieve filtered incidents
    When the console incidents view is requested filtered by status "OPEN" without authentication
    Then the response is unauthorized
