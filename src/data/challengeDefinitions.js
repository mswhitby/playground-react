export const challengeDefinitions = {
  "temperature-alert": {
    "problem": "Given an integer temperature in degrees Fahrenheit, return `Freeze` when it is 32 or below, `Heat` when it is 90 or above, and `Normal` otherwise. Include the boundary values.",
    "examples": [
      {
        "input": [
          32
        ],
        "expected": "Freeze"
      },
      {
        "input": [
          90
        ],
        "expected": "Heat"
      },
      {
        "input": [
          72
        ],
        "expected": "Normal"
      }
    ],
    "signature": [
      "degrees: int",
      "str",
      "int degrees",
      "String",
      "int degrees",
      "string",
      "degrees"
    ]
  },
  "count-matches": {
    "problem": "Given integer event codes and a target, count the positions equal to the target, including duplicates. Empty arrays produce 0.",
    "examples": [
      {
        "input": [
          [
            2,
            1,
            2,
            3,
            2
          ],
          2
        ],
        "expected": 3
      },
      {
        "input": [
          [],
          7
        ],
        "expected": 0
      },
      {
        "input": [
          [
            3,
            4
          ],
          5
        ],
        "expected": 0
      }
    ],
    "signature": [
      "events: list[int], target: int",
      "int",
      "int[] events, int target",
      "int",
      "int[] events, int target",
      "int",
      "events, target"
    ]
  },
  "sum-positives": {
    "problem": "Given an integer array, add only values strictly greater than zero. Ignore zeros and negative values. Return 0 if none are positive.",
    "examples": [
      {
        "input": [
          [
            -3,
            6,
            0,
            2,
            -1
          ]
        ],
        "expected": 8
      },
      {
        "input": [
          [
            0,
            -1
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          []
        ],
        "expected": 0
      }
    ],
    "signature": [
      "numbers: list[int]",
      "int",
      "int[] numbers",
      "int",
      "int[] numbers",
      "int",
      "numbers"
    ]
  },
  "score-line": {
    "problem": "Given a player name and integer points, return the exact format `Name: N points`. Preserve the name and spaces; use one space after the colon and before `points`.",
    "examples": [
      {
        "input": [
          "Avery",
          18
        ],
        "expected": "Avery: 18 points"
      },
      {
        "input": [
          "Jordan Lee",
          0
        ],
        "expected": "Jordan Lee: 0 points"
      },
      {
        "input": [
          "Mia",
          -2
        ],
        "expected": "Mia: -2 points"
      }
    ],
    "signature": [
      "name: str, points: int",
      "str",
      "String name, int points",
      "String",
      "string name, int points",
      "string",
      "name, points"
    ]
  },
  "attendance-percent": {
    "problem": "Given present students and total enrolled, return the whole-number attendance percentage rounded down: `floor(100 × present / total)`. Total is always positive.",
    "examples": [
      {
        "input": [
          18,
          20
        ],
        "expected": 90
      },
      {
        "input": [
          2,
          3
        ],
        "expected": 66
      },
      {
        "input": [
          0,
          30
        ],
        "expected": 0
      }
    ],
    "signature": [
      "present: int, total: int",
      "int",
      "int present, int total",
      "int",
      "int present, int total",
      "int",
      "present, total"
    ]
  },
  "longest-win-streak": {
    "problem": "Given a boolean array where true means a win, return the longest consecutive run of true values. Reset the streak after a loss; return 0 when there are no wins.",
    "examples": [
      {
        "input": [
          [
            true,
            true,
            false,
            true,
            true,
            true
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            false,
            false
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          []
        ],
        "expected": 0
      }
    ],
    "signature": [
      "wins: list[bool]",
      "int",
      "boolean[] wins",
      "int",
      "bool[] wins",
      "int",
      "wins"
    ]
  },
  "confidence-total": {
    "problem": "Given equally sized `correct` boolean and positive `weights` integer arrays, sum the weights at positions where `correct[i]` is true. Return 0 for empty arrays. This is a weighted-prediction scoring exercise, not a betting task.",
    "examples": [
      {
        "input": [
          [
            true,
            false,
            true
          ],
          [
            20,
            18,
            15
          ]
        ],
        "expected": 35
      },
      {
        "input": [
          [
            false,
            false
          ],
          [
            5,
            8
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          [],
          []
        ],
        "expected": 0
      }
    ],
    "signature": [
      "correct: list[bool], weights: list[int]",
      "int",
      "boolean[] correct, int[] weights",
      "int",
      "bool[] correct, int[] weights",
      "int",
      "correct, weights"
    ]
  },
  "second-largest-distinct": {
    "problem": "Given integers, return the second-largest **distinct** value, or `null` (`None` for Python) when fewer than two distinct values exist. Negative values are valid.",
    "examples": [
      {
        "input": [
          [
            3,
            1,
            3,
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            5,
            5
          ]
        ],
        "expected": null
      },
      {
        "input": [
          [
            -10,
            -7,
            -7,
            -2
          ]
        ],
        "expected": -7
      }
    ],
    "signature": [
      "numbers: list[int]",
      "int | None",
      "int[] numbers",
      "Integer",
      "int[] numbers",
      "int?",
      "numbers"
    ]
  },
  "target-pairs": {
    "problem": "Count pairs of different array indices `(i,j)` with `i < j` and sum equal to target. Duplicates at different positions count as separate pairs.",
    "examples": [
      {
        "input": [
          [
            1,
            3,
            2,
            2,
            4
          ],
          4
        ],
        "expected": 2
      },
      {
        "input": [
          [
            2,
            2,
            2
          ],
          4
        ],
        "expected": 3
      },
      {
        "input": [
          [],
          1
        ],
        "expected": 0
      }
    ],
    "signature": [
      "numbers: list[int], target: int",
      "int",
      "int[] numbers, int target",
      "int",
      "int[] numbers, int target",
      "int",
      "numbers, target"
    ]
  },
  "competition-ranks": {
    "problem": "Rank scores in original participant order using competition ranking: higher scores rank first, ties share rank, and ranks after ties skip occupied positions (e.g., [50,50,40] => [1,1,3]).",
    "examples": [
      {
        "input": [
          [
            50,
            50,
            40,
            20,
            40
          ]
        ],
        "expected": [
          1,
          1,
          3,
          5,
          3
        ]
      },
      {
        "input": [
          [
            7,
            12,
            9
          ]
        ],
        "expected": [
          3,
          1,
          2
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ],
    "signature": [
      "scores: list[int]",
      "list[int]",
      "int[] scores",
      "int[]",
      "int[] scores",
      "int[]",
      "scores"
    ]
  }
};
