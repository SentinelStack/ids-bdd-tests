@api @account
Feature: Two-factor login errors
  The 2FA second step rejects wrong codes and invalid challenge tokens with 401
  and malformed requests with 400.

  Scenario: A wrong TOTP code is rejected
    Given the operator has started a login that requires a second factor
    When the operator completes the second factor with code "000000"
    Then the response status is 401

  Scenario: An invalid challenge token is rejected
    Given the operator has started a login that requires a second factor
    When the operator completes the second factor with an invalid challenge token
    Then the response status is 401

  Scenario Outline: Malformed second-factor requests are rejected as bad requests
    When the operator completes the second factor with the body '<body>'
    Then the response status is 400

    Examples:
      | body                      |
      | {}                        |
      | {"mfaToken":"abc"}        |
      | {"code":"123456"}         |
