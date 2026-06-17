@api @account
Feature: Autentificarea cu al doilea factor (TOTP)

  Scenario: După parolă, codul TOTP întoarce un jeton de sesiune
    When operatorul se autentifică cu parola
    And autentificarea cere al doilea factor
    And operatorul trimite codul TOTP
    Then operatorul primește un jeton de sesiune
