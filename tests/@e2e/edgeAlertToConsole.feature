@e2e
Feature: Fluxul complet — alerta de la margine ajunge în consolă

  Background:
    Given operatorul este autentificat prin API

  Scenario: O anomalie raportată de agent apare în consolă
    When agentul raportează o anomalie
    Then alerta apare în consolă în cel mult 20 secunde
