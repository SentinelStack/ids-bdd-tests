@api @alerts
Feature: Listarea alertelor — autorizare

  Scenario: Un client neautentificat nu poate lista alertele
    When un client neautentificat listează alertele
    Then răspunsul are statusul 401
