@api @rules
Feature: Regulile de detecție de margine

  Background:
    Given operatorul este autentificat prin API

  Scenario: Operatorul listează regulile de detecție
    When operatorul listează regulile
    Then răspunsul are statusul 200
