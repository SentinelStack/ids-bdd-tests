@api @account
Feature: Sign in with Google errors
  Google sign-in rejects an invalid ID token with 401 and a missing token with
  400. A genuine success needs a live Google token, so it is left as a skipped
  placeholder.

  Scenario: An invalid Google ID token is rejected
    When the operator signs in with Google id token "not-a-valid-google-jwt"
    Then the response status is 401

  Scenario Outline: Missing the Google ID token is a bad request
    When the operator signs in with Google using the body '<body>'
    Then the response status is 400

    Examples:
      | body           |
      | {}             |
      | {"idToken":""} |

  @skip
  Scenario: Signing in with a valid Google ID token succeeds
    # TODO: requires a live Google Identity Services ID token (cannot be minted offline).
    # Provide a real idToken via env/secret and assert 200 + a JWT in data.token.
    When the operator signs in with Google id token "REPLACE_WITH_LIVE_GOOGLE_ID_TOKEN"
    Then the response status is 200
    And the response indicates success
