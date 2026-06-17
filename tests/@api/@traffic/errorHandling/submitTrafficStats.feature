@api @traffic
Feature: Submit traffic statistics - error handling (agent)
  Malformed or unauthenticated traffic-statistics submissions to
  POST /api/traffic/stats are rejected before any window is stored.

  Scenario Outline: Submitting a window missing a mandatory counter is rejected
    When the agent submits traffic statistics without the "<field>" counter
    Then the response status is 400

    Examples:
      | field        |
      | totalPackets |
      | totalBytes   |
      | windowSeconds |

  Scenario Outline: Submitting a window with a negative counter is rejected
    When the agent submits traffic statistics with "<field>" set to <value>
    Then the response status is 400

    Examples:
      | field        | value |
      | totalPackets | -1    |
      | totalBytes   | -512  |
      | tcpPackets   | -7    |

  Scenario: Submitting traffic statistics without the agent API key is unauthorized
    When an unauthenticated agent submits valid traffic statistics
    Then the response status is 401
