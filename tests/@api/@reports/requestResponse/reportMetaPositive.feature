@api @reports
Feature: Metadatele de export

  Background:
    Given operatorul este autentificat prin API

  Scenario: Formularul de export își ia metadatele
    When operatorul cere metadatele de export
    Then răspunsul are statusul 200
