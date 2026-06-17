@api @rules
Feature: Listing rules error handling
  As the rules API
  I want to reject unauthenticated rule listing
  So that detection configuration is not exposed to anonymous callers

  Scenario: Listing rules without authentication is rejected
    When I list the rules without authentication
    Then the response status is 401
