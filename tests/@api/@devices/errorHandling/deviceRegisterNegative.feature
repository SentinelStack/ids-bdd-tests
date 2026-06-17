@api @devices
Feature: Înregistrarea dispozitivului — validare

  Scenario: Înregistrarea fără nume este respinsă
    When agentul înregistrează un dispozitiv fără nume
    Then răspunsul are statusul 400
