@e2e
Feature: Detecția unei scanări de porturi

  # Scenariu care, în varianta completă, presupune declanșarea unei scanări reale (Nmap)
  # împotriva rețelei monitorizate; aici se verifică propagarea alertei până în consolă.
  Background:
    Given operatorul este autentificat prin API

  Scenario: O alertă de scanare ajunge în consolă
    When agentul raportează o anomalie
    Then alerta apare în consolă în cel mult 30 secunde
