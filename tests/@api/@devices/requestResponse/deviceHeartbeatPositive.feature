@api @devices
Feature: Semnalul de viață al dispozitivului

  Scenario: Agentul trimite un semnal de viață după înregistrare
    When agentul înregistrează un dispozitiv nou
    And agentul trimite un semnal de viață
    Then răspunsul are statusul 200
