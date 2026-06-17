@web @console
Feature: Autentificarea în consola AEGIS IDS

  # Notă: presupune un cont de test cu 2FA și secret TOTP cunoscut (OPERATOR_TOTP_SECRET).
  Scenario: Operatorul se autentifică cu parolă și al doilea factor
    Given operatorul deschide pagina de autentificare
    When operatorul introduce credențialele
    And operatorul introduce codul TOTP
    Then tabloul de bord este afișat
