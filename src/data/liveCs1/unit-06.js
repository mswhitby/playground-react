// Public Computer Science I Unit 6 content copied from published classroom site.
export default [
  {
    "id": "06-iteration/01-for-ranges",
    "unit": 6,
    "unitName": "Iteration & Accumulation",
    "lesson": 1,
    "slug": "01-for-ranges",
    "title": "Repeat an instruction",
    "concept": "For loops and ranges  ",
    "summary": "A loop makes Python repeat an instruction without copying the same line over and over. `range()` produces a sequence of integer values.",
    "mode": "script",
    "starter": "# Use one loop to print the integers 1 through 4.\n",
    "cases": [
      {
        "expected": "1\n2\n3\n4"
      }
    ],
    "points": 5,
    "hints": [
      "`range()` controls how many loop iterations occur.",
      "The ending argument is not included.",
      "Place a single print call inside the loop."
    ],
    "markdown": "06-iteration/lessons/01-for-ranges.md",
    "language": "python",
    "markdownSource": "# Iteration & Accumulation — Lesson 1: Repeat an instruction\n\n**New skill:** For loops and ranges  \n**Previously learned:** Unit 05 — conditional execution\n\n## Why this matters\n\nA loop makes Python repeat an instruction without copying the same line over and over. `range()` produces a sequence of integer values.\n\n## Study this example\n\n```python\nfor checkpoint in range(1, 5):\n    print(checkpoint)\n```\n\nThe displayed values are 1, 2, 3, 4. The final argument of `range()` is exclusive. The body must be indented.\n\nBefore moving on, predict the result of the program or function. Then run it and compare.\n\n## Check your understanding\n\nWhat values are produced by `range(2, 6)`?\n\n## Common mistake\n\n`range(1, 5)` does not include 5. Use `range(1, 6)` when you need to include 5.\n\n## Practice\n\nUse a loop with `range()` to display the integers **1, 2, 3, 4** on separate lines. Do not use four individual print statements.\n\n**Expected console output**\n\n```text\n1\n2\n3\n4\n```\n\n**[Open the Python starter](../practice/01-for-ranges/main.py)**\n\n<details>\n<summary>Hint 1</summary>\n\n`range()` controls how many loop iterations occur.\n\n</details>\n\n<details>\n<summary>Hint 2</summary>\n\nThe ending argument is not included.\n\n</details>\n\n<details>\n<summary>Hint 3</summary>\n\nPlace a single print call inside the loop.\n\n</details>\n\n## Reflection\n\nExplain why your solution works and describe one boundary case you tried.\n"
  },
  {
    "id": "06-iteration/02-running-total",
    "unit": 6,
    "unitName": "Iteration & Accumulation",
    "lesson": 2,
    "slug": "02-running-total",
    "title": "Add values as you go",
    "concept": "Accumulator variable  ",
    "summary": "A running total begins at a starting value and changes every time a loop visits another item.",
    "mode": "function",
    "starter": "def sum_to_limit(limit):\n    # Add every integer from 1 up to and including limit.\n    pass\n",
    "cases": [
      {
        "call": "sum_to_limit(4)",
        "expected": "10"
      },
      {
        "call": "sum_to_limit(0)",
        "expected": "0"
      },
      {
        "call": "sum_to_limit(1)",
        "expected": "1"
      },
      {
        "call": "sum_to_limit(8)",
        "expected": "36"
      }
    ],
    "points": 5,
    "hints": [
      "Start a total variable at zero.",
      "Remember the endpoint rule for `range()`.",
      "Update the total on each iteration and return it at the end."
    ],
    "markdown": "06-iteration/lessons/02-running-total.md",
    "functionName": "sum_to_limit",
    "language": "python",
    "markdownSource": "# Iteration & Accumulation — Lesson 2: Add values as you go\n\n**New skill:** Accumulator variable  \n**Previously learned:** Unit 05 — conditional execution\n\n## Why this matters\n\nA running total begins at a starting value and changes every time a loop visits another item.\n\n## Study this example\n\n```python\ntotal = 0\nfor number in range(1, 4):\n    total += number\nprint(total)\n```\n\nFirst total is 0. The loop adds 1, then 2, then 3, producing 6. `+=` is shorthand for assigning the previous value plus a new amount.\n\nBefore moving on, predict the result of the program or function. Then run it and compare.\n\n## Check your understanding\n\nWhat happens if the starting total is 10 instead of 0?\n\n## Common mistake\n\nInitialize the accumulator **before** the loop. Inside the loop would reset it on every iteration.\n\n## Practice\n\nComplete `sum_to_limit(limit)` to return the **sum of every integer from 1 through limit, inclusive**. `limit` is a nonnegative integer.\n\n### Public example 1\n\n**Input**\n\n```python\nsum_to_limit(4)\n```\n\n**Output**\n\n```python\n10\n```\n\n### Public example 2\n\n**Input**\n\n```python\nsum_to_limit(0)\n```\n\n**Output**\n\n```python\n0\n```\n\n### Public example 3\n\n**Input**\n\n```python\nsum_to_limit(1)\n```\n\n**Output**\n\n```python\n1\n```\n\n### Public example 4\n\n**Input**\n\n```python\nsum_to_limit(8)\n```\n\n**Output**\n\n```python\n36\n```\n\n**[Open the Python starter](../practice/02-running-total/main.py)**\n\n<details>\n<summary>Hint 1</summary>\n\nStart a total variable at zero.\n\n</details>\n\n<details>\n<summary>Hint 2</summary>\n\nRemember the endpoint rule for `range()`.\n\n</details>\n\n<details>\n<summary>Hint 3</summary>\n\nUpdate the total on each iteration and return it at the end.\n\n</details>\n\n## Reflection\n\nExplain why your solution works and describe one boundary case you tried.\n"
  },
  {
    "id": "06-iteration/03-count-matches",
    "unit": 6,
    "unitName": "Iteration & Accumulation",
    "lesson": 3,
    "slug": "03-count-matches",
    "title": "Count matches in a range",
    "concept": "Counters, modulo, and conditional loops  ",
    "summary": "You can combine an if statement with a loop to count how many numbers meet a rule.",
    "mode": "function",
    "starter": "def count_multiples_of_three(limit):\n    # Count numbers in the range that are divisible by 3.\n    pass\n",
    "cases": [
      {
        "call": "count_multiples_of_three(10)",
        "expected": "3"
      },
      {
        "call": "count_multiples_of_three(3)",
        "expected": "1"
      },
      {
        "call": "count_multiples_of_three(2)",
        "expected": "0"
      },
      {
        "call": "count_multiples_of_three(15)",
        "expected": "5"
      }
    ],
    "points": 10,
    "hints": [
      "Which operator checks if division has no remainder?",
      "Visit each integer in the inclusive interval.",
      "Only increase the counter for numbers divisible by 3."
    ],
    "markdown": "06-iteration/lessons/03-count-matches.md",
    "functionName": "count_multiples_of_three",
    "language": "python",
    "markdownSource": "# Iteration & Accumulation — Lesson 3: Count matches in a range\n\n**New skill:** Counters, modulo, and conditional loops  \n**Previously learned:** Unit 05 — conditional execution\n\n## Why this matters\n\nYou can combine an if statement with a loop to count how many numbers meet a rule.\n\n## Study this example\n\n```python\ncount = 0\nfor n in range(1, 7):\n    if n % 2 == 0:\n        count += 1\nprint(count)\n```\n\nThe modulo operator `%` gives the remainder. Values divisible by 2 have a remainder of 0; among 1 through 6, there are three even numbers.\n\nBefore moving on, predict the result of the program or function. Then run it and compare.\n\n## Check your understanding\n\nHow many even numbers are there from 1 through 9?\n\n## Common mistake\n\nIncrement the count only if a number satisfies the condition, not on every loop iteration.\n\n## Practice\n\nComplete `count_multiples_of_three(limit)` to return how many positive integers from **1 through limit, inclusive** are divisible by **3**. `limit` is a nonnegative integer.\n\n### Public example 1\n\n**Input**\n\n```python\ncount_multiples_of_three(10)\n```\n\n**Output**\n\n```python\n3\n```\n\n### Public example 2\n\n**Input**\n\n```python\ncount_multiples_of_three(3)\n```\n\n**Output**\n\n```python\n1\n```\n\n### Public example 3\n\n**Input**\n\n```python\ncount_multiples_of_three(2)\n```\n\n**Output**\n\n```python\n0\n```\n\n### Public example 4\n\n**Input**\n\n```python\ncount_multiples_of_three(15)\n```\n\n**Output**\n\n```python\n5\n```\n\n**[Open the Python starter](../practice/03-count-matches/main.py)**\n\n<details>\n<summary>Hint 1</summary>\n\nWhich operator checks if division has no remainder?\n\n</details>\n\n<details>\n<summary>Hint 2</summary>\n\nVisit each integer in the inclusive interval.\n\n</details>\n\n<details>\n<summary>Hint 3</summary>\n\nOnly increase the counter for numbers divisible by 3.\n\n</details>\n\n## Reflection\n\nExplain why your solution works and describe one boundary case you tried.\n"
  },
  {
    "id": "06-iteration/04-build-launch-countdown",
    "unit": 6,
    "unitName": "Iteration & Accumulation",
    "lesson": 4,
    "slug": "04-build-launch-countdown",
    "title": "Launch Countdown",
    "concept": "Loops, conditions, strings and return values  ",
    "summary": "A robotics launch controller needs to report every countdown number and then announce launch.",
    "mode": "function",
    "starter": "def create_countdown(start):\n    # Build and return a countdown string.\n    pass\n",
    "cases": [
      {
        "call": "create_countdown(3)",
        "expected": "'3\\n2\\n1\\nLaunch!'"
      },
      {
        "call": "create_countdown(1)",
        "expected": "'1\\nLaunch!'"
      },
      {
        "call": "create_countdown(5)",
        "expected": "'5\\n4\\n3\\n2\\n1\\nLaunch!'"
      }
    ],
    "points": 15,
    "hints": [
      "You'll need a loop that visits numbers in reverse order.",
      "Use `str()` to turn each number into text before appending.",
      "Use `\\n` between lines and add `Launch!` only once at the end."
    ],
    "markdown": "06-iteration/lessons/04-build-launch-countdown.md",
    "functionName": "create_countdown",
    "language": "python",
    "markdownSource": "# Iteration & Accumulation — Lesson 4: Build: Launch Countdown\n\n**New skill:** Loops, conditions, strings and return values  \n**Previously learned:** Unit 05 — conditional execution\n\n## Why this matters\n\nA robotics launch controller needs to report every countdown number and then announce launch.\n\n## Study this example\n\n```python\ndef count_up(stop):\n    message = ''\n    for n in range(1, stop + 1):\n        message += str(n) + '\\n'\n    return message + 'Done'\n```\n\nHere `str(n)` turns a number into text. The newline `\\n` separates lines within one returned string. The final message is added after the loop finishes.\n\nBefore moving on, predict the result of the program or function. Then run it and compare.\n\n## Check your understanding\n\nWhy is `str(n)` necessary before joining it to a string with `+`?\n\n## Common mistake\n\nBuilding and returning one string is different from printing multiple separate lines.\n\n## Practice\n\nComplete `create_countdown(start)` to **return one string** containing a countdown from `start` to `1`, each on its own line, followed by `Launch!`. `start` is a positive integer. Example for 3: `3\\n2\\n1\\nLaunch!`.\n\n### Public example 1\n\n**Input**\n\n```python\ncreate_countdown(3)\n```\n\n**Output**\n\n```python\n'3\\n2\\n1\\nLaunch!'\n```\n\n### Public example 2\n\n**Input**\n\n```python\ncreate_countdown(1)\n```\n\n**Output**\n\n```python\n'1\\nLaunch!'\n```\n\n### Public example 3\n\n**Input**\n\n```python\ncreate_countdown(5)\n```\n\n**Output**\n\n```python\n'5\\n4\\n3\\n2\\n1\\nLaunch!'\n```\n\n**[Open the Python starter](../practice/04-build-launch-countdown/main.py)**\n\n<details>\n<summary>Hint 1</summary>\n\nYou'll need a loop that visits numbers in reverse order.\n\n</details>\n\n<details>\n<summary>Hint 2</summary>\n\nUse `str()` to turn each number into text before appending.\n\n</details>\n\n<details>\n<summary>Hint 3</summary>\n\nUse `\\n` between lines and add `Launch!` only once at the end.\n\n</details>\n\n## Reflection\n\nExplain why your solution works and describe one boundary case you tried.\n"
  }
];
