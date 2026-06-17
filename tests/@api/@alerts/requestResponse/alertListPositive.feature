@api @alerts
Feature: Listarea alertelor

  Background:
    Given operatorul este autentificat prin API

  Scenario: Operatorul listează cele mai recente alerte
    When operatorul listează alertele
    Then răspunsul are statusul 200
    And alertele respectă schema
