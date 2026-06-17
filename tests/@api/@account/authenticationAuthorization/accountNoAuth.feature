@api @account
Feature: Accesul la cont necesită autentificare

  Scenario: Fără jeton, contul nu este accesibil
    When un client neautentificat cere contul
    Then răspunsul are statusul 401
