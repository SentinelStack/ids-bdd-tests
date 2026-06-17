@api @account
Feature: Autentificarea operatorului cu parolă

  Scenario: Cererea de autentificare cu parolă este acceptată
    When operatorul se autentifică cu parola
    Then răspunsul are statusul 200
