@api @account
Feature: Operator login errors
  Login rejects bad credentials with 401 and malformed requests with 400.

  Scenario: A wrong password is rejected
    When the operator logs in with username "george.lupu" and password "definitely-wrong"
    Then the response is unauthorized

  Scenario: An unknown user is rejected
    When the operator logs in with username "ghost.user" and password "AegisSOC!2026"
    Then the response is unauthorized

  Scenario Outline: Malformed login requests are rejected as bad requests
    When the operator logs in with the body '<body>'
    Then the response status is 400

    Examples:
      | body                            |
      | {}                              |
      | {"username":"george.lupu"}      |
      | {"password":"AegisSOC!2026"}    |
