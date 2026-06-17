@web @console
Feature: Tabloul de bord

  Scenario: Tabloul de bord afișează alertele live
    Given operatorul deschide pagina de autentificare
    When operatorul introduce credențialele
    And operatorul introduce codul TOTP
    Then tabloul de bord este afișat
    And alertele live sunt vizibile
