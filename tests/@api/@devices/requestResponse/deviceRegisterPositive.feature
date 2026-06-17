@api @devices
Feature: Înregistrarea dispozitivului de margine

  Scenario: Un dispozitiv nou este înregistrat și primește un identificator
    When agentul înregistrează un dispozitiv nou
    Then răspunsul are statusul 201
    And dispozitivul respectă schema
