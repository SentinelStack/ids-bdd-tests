@api @alerts
Feature: Filtrarea alertelor

  Background:
    Given operatorul este autentificat prin API

  Scenario: Operatorul filtrează alertele după severitate
    When operatorul filtrează alertele după severitatea "HIGH"
    Then răspunsul are statusul 200
