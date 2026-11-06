// Public Computer Science I Unit 5 content copied from published classroom site.
export default [
  {
    "id": "05-conditional-execution/01-first-if",
    "unit": 5,
    "unitName": "Conditional Execution",
    "lesson": 1,
    "slug": "01-first-if",
    "title": "Make a choice with if",
    "concept": "If statements and indentation  ",
    "summary": "Programs can make a choice based on a Boolean expression. Python executes the indented body of an if statement only when its condition is true.",
    "mode": "function",
    "starter": "def classify_temperature(temperature):\n    message = 'Normal'\n    # Change the message when the temperature is below 10.\n    return message\n",
    "cases": [
      {
        "call": "classify_temperature(5)",
        "expected": "'Cold alert'"
      },
      {
        "call": "classify_temperature(10)",
        "expected": "'Normal'"
      },
      {
        "call": "classify_temperature(-4)",
        "expected": "'Cold alert'"
      }
    ],
    "points": 5,
    "hints": [
      "Choose the comparison for below 10.",
      "Only update `message` when your condition is true.",
      "Keep `return message` after the conditional block."
    ],
    "markdown": "05-conditional-execution/lessons/01-first-if.md",
    "functionName": "classify_temperature",
    "language": "python",
    "markdownSource": "# Conditional Execution — Lesson 1: Make a choice with if\n\n**New skill:** If statements and indentation  \n**Previously learned:** Unit 04 — comparisons and Boolean logic\n\n## Why this matters\n\nPrograms can make a choice based on a Boolean expression. Python executes the indented body of an if statement only when its condition is true.\n\n## Study this example\n\n```python\ndef warning(battery):\n    message = 'Ready'\n    if battery < 20:\n        message = 'Charge needed'\n    return message\n```\n\nFor `warning(15)` the condition is true, so the message changes. For `warning(90)` Python skips the indented assignment and returns 'Ready'. The colon and indentation are required.\n\nBefore moving on, predict the result of the program or function. Then run it and compare.\n\n## Check your understanding\n\nWhat would `warning(20)` return? What does the indentation tell Python?\n\n## Common mistake\n\nThe colon after if and the indentation underneath it are part of Python syntax.\n\n## Practice\n\nComplete `classify_temperature(temperature)` so it returns `'Cold alert'` for temperatures **below 10**, and `'Normal'` otherwise.\n\n### Public example 1\n\n**Input**\n\n```python\nclassify_temperature(5)\n```\n\n**Output**\n\n```python\n'Cold alert'\n```\n\n### Public example 2\n\n**Input**\n\n```python\nclassify_temperature(10)\n```\n\n**Output**\n\n```python\n'Normal'\n```\n\n### Public example 3\n\n**Input**\n\n```python\nclassify_temperature(-4)\n```\n\n**Output**\n\n```python\n'Cold alert'\n```\n\n**[Open the Python starter](../practice/01-first-if/main.py)**\n\n<details>\n<summary>Hint 1</summary>\n\nChoose the comparison for below 10.\n\n</details>\n\n<details>\n<summary>Hint 2</summary>\n\nOnly update `message` when your condition is true.\n\n</details>\n\n<details>\n<summary>Hint 3</summary>\n\nKeep `return message` after the conditional block.\n\n</details>\n\n## Reflection\n\nExplain why your solution works and describe one boundary case you tried.\n"
  },
  {
    "id": "05-conditional-execution/02-if-else",
    "unit": 5,
    "unitName": "Conditional Execution",
    "lesson": 2,
    "slug": "02-if-else",
    "title": "Two possible paths",
    "concept": "If and else  ",
    "summary": "An `if`/`else` structure guarantees that exactly one of two branches runs.",
    "mode": "function",
    "starter": "def classify_pass_status(points):\n    # Decide between the two exact messages.\n    pass\n",
    "cases": [
      {
        "call": "classify_pass_status(70)",
        "expected": "'Pass'"
      },
      {
        "call": "classify_pass_status(69)",
        "expected": "'Retry'"
      },
      {
        "call": "classify_pass_status(100)",
        "expected": "'Pass'"
      }
    ],
    "points": 5,
    "hints": [
      "Which comparison includes 70?",
      "Write one branch for meeting the threshold and one for failing it.",
      "Return the exact capitalized word requested."
    ],
    "markdown": "05-conditional-execution/lessons/02-if-else.md",
    "functionName": "classify_pass_status",
    "language": "python",
    "markdownSource": "# Conditional Execution — Lesson 2: Two possible paths\n\n**New skill:** If and else  \n**Previously learned:** Unit 04 — comparisons and Boolean logic\n\n## Why this matters\n\nAn `if`/`else` structure guarantees that exactly one of two branches runs.\n\n## Study this example\n\n```python\ndef can_start(energy):\n    if energy >= 50:\n        return 'Start'\n    else:\n        return 'Recharge'\n```\n\nWhen the comparison is true, the first branch returns. Otherwise, the else branch returns. Both return values are strings.\n\nBefore moving on, predict the result of the program or function. Then run it and compare.\n\n## Check your understanding\n\nWhat does `can_start(50)` return, and why?\n\n## Common mistake\n\nAvoid returning a Boolean when the prompt explicitly requires a string.\n\n## Practice\n\nComplete `classify_pass_status(points)` so it returns `'Pass'` for scores at least **70**, and `'Retry'` otherwise.\n\n### Public example 1\n\n**Input**\n\n```python\nclassify_pass_status(70)\n```\n\n**Output**\n\n```python\n'Pass'\n```\n\n### Public example 2\n\n**Input**\n\n```python\nclassify_pass_status(69)\n```\n\n**Output**\n\n```python\n'Retry'\n```\n\n### Public example 3\n\n**Input**\n\n```python\nclassify_pass_status(100)\n```\n\n**Output**\n\n```python\n'Pass'\n```\n\n**[Open the Python starter](../practice/02-if-else/main.py)**\n\n<details>\n<summary>Hint 1</summary>\n\nWhich comparison includes 70?\n\n</details>\n\n<details>\n<summary>Hint 2</summary>\n\nWrite one branch for meeting the threshold and one for failing it.\n\n</details>\n\n<details>\n<summary>Hint 3</summary>\n\nReturn the exact capitalized word requested.\n\n</details>\n\n## Reflection\n\nExplain why your solution works and describe one boundary case you tried.\n"
  },
  {
    "id": "05-conditional-execution/03-elif-bands",
    "unit": 5,
    "unitName": "Conditional Execution",
    "lesson": 3,
    "slug": "03-elif-bands",
    "title": "More than two outcomes",
    "concept": "Elif chains and mutually exclusive ranges  ",
    "summary": "Use `elif` to check another condition after the first fails. In a chain, Python selects the first true branch.",
    "mode": "function",
    "starter": "def classify_score(score):\n    # Choose exactly one award band.\n    pass\n",
    "cases": [
      {
        "call": "classify_score(92)",
        "expected": "'Gold'"
      },
      {
        "call": "classify_score(70)",
        "expected": "'Silver'"
      },
      {
        "call": "classify_score(69)",
        "expected": "'Bronze'"
      },
      {
        "call": "classify_score(90)",
        "expected": "'Gold'"
      }
    ],
    "points": 10,
    "hints": [
      "Check the highest threshold first.",
      "After scores of 90+ are handled, what does >= 70 mean?",
      "Use `else` for every remaining score."
    ],
    "markdown": "05-conditional-execution/lessons/03-elif-bands.md",
    "functionName": "classify_score",
    "language": "python",
    "markdownSource": "# Conditional Execution — Lesson 3: More than two outcomes\n\n**New skill:** Elif chains and mutually exclusive ranges  \n**Previously learned:** Unit 04 — comparisons and Boolean logic\n\n## Why this matters\n\nUse `elif` to check another condition after the first fails. In a chain, Python selects the first true branch.\n\n## Study this example\n\n```python\ndef light(status):\n    if status >= 80:\n        return 'Green'\n    elif status >= 40:\n        return 'Yellow'\n    else:\n        return 'Red'\n```\n\nA value of 90 chooses the first branch. A value of 60 skips the first but matches the second. A value of 20 reaches else.\n\nBefore moving on, predict the result of the program or function. Then run it and compare.\n\n## Check your understanding\n\nWhy does `light(95)` return 'Green' rather than 'Yellow' even though 95 is also >= 40?\n\n## Common mistake\n\nAlways order comparisons with overlapping ranges carefully; earlier matching branches win.\n\n## Practice\n\nComplete `classify_score(score)` to return `'Gold'` for **90 or above**, `'Silver'` for **70 through 89**, and `'Bronze'` for anything below 70.\n\n### Public example 1\n\n**Input**\n\n```python\nclassify_score(92)\n```\n\n**Output**\n\n```python\n'Gold'\n```\n\n### Public example 2\n\n**Input**\n\n```python\nclassify_score(70)\n```\n\n**Output**\n\n```python\n'Silver'\n```\n\n### Public example 3\n\n**Input**\n\n```python\nclassify_score(69)\n```\n\n**Output**\n\n```python\n'Bronze'\n```\n\n### Public example 4\n\n**Input**\n\n```python\nclassify_score(90)\n```\n\n**Output**\n\n```python\n'Gold'\n```\n\n**[Open the Python starter](../practice/03-elif-bands/main.py)**\n\n<details>\n<summary>Hint 1</summary>\n\nCheck the highest threshold first.\n\n</details>\n\n<details>\n<summary>Hint 2</summary>\n\nAfter scores of 90+ are handled, what does >= 70 mean?\n\n</details>\n\n<details>\n<summary>Hint 3</summary>\n\nUse `else` for every remaining score.\n\n</details>\n\n## Reflection\n\nExplain why your solution works and describe one boundary case you tried.\n"
  },
  {
    "id": "05-conditional-execution/04-build-ride-classifier",
    "unit": 5,
    "unitName": "Conditional Execution",
    "lesson": 4,
    "slug": "04-build-ride-classifier",
    "title": "Event Ticket Classifier",
    "concept": "Conditionals and Boolean logic together  ",
    "summary": "A student event app classifies each ticket request using more than one condition.",
    "mode": "function",
    "starter": "def classify_ticket(age, has_pass):\n    # A valid pass takes priority over age bands.\n    pass\n",
    "cases": [
      {
        "call": "classify_ticket(15, True)",
        "expected": "'Member'"
      },
      {
        "call": "classify_ticket(15, False)",
        "expected": "'Youth'"
      },
      {
        "call": "classify_ticket(18, False)",
        "expected": "'Guest'"
      },
      {
        "call": "classify_ticket(30, True)",
        "expected": "'Member'"
      }
    ],
    "points": 15,
    "hints": [
      "Check the pass before classifying by age.",
      "An age of 18 belongs to the Guest branch.",
      "Use if / elif / else to select one exact label."
    ],
    "markdown": "05-conditional-execution/lessons/04-build-ride-classifier.md",
    "functionName": "classify_ticket",
    "language": "python",
    "markdownSource": "# Conditional Execution — Lesson 4: Build: Event Ticket Classifier\n\n**New skill:** Conditionals and Boolean logic together  \n**Previously learned:** Unit 04 — comparisons and Boolean logic\n\n## Why this matters\n\nA student event app classifies each ticket request using more than one condition.\n\n## Study this example\n\n```python\ndef category(age, vip):\n    if vip:\n        return 'Priority'\n    elif age < 13:\n        return 'Junior'\n    else:\n        return 'General'\n```\n\nPriority comes first, so it applies even if the guest is also younger than 13. The order of the checks communicates the intended rule.\n\nBefore moving on, predict the result of the program or function. Then run it and compare.\n\n## Check your understanding\n\nWhy does `category(10, True)` return 'Priority'?\n\n## Common mistake\n\nDo not test the age band before the VIP condition if priority must take precedence.\n\n## Practice\n\nComplete `classify_ticket(age, has_pass)` to return `'Member'` if `has_pass` is true, otherwise `'Youth'` if `age` is **under 18**, otherwise `'Guest'`. Return a string in every case.\n\n### Public example 1\n\n**Input**\n\n```python\nclassify_ticket(15, True)\n```\n\n**Output**\n\n```python\n'Member'\n```\n\n### Public example 2\n\n**Input**\n\n```python\nclassify_ticket(15, False)\n```\n\n**Output**\n\n```python\n'Youth'\n```\n\n### Public example 3\n\n**Input**\n\n```python\nclassify_ticket(18, False)\n```\n\n**Output**\n\n```python\n'Guest'\n```\n\n### Public example 4\n\n**Input**\n\n```python\nclassify_ticket(30, True)\n```\n\n**Output**\n\n```python\n'Member'\n```\n\n**[Open the Python starter](../practice/04-build-ride-classifier/main.py)**\n\n<details>\n<summary>Hint 1</summary>\n\nCheck the pass before classifying by age.\n\n</details>\n\n<details>\n<summary>Hint 2</summary>\n\nAn age of 18 belongs to the Guest branch.\n\n</details>\n\n<details>\n<summary>Hint 3</summary>\n\nUse if / elif / else to select one exact label.\n\n</details>\n\n## Reflection\n\nExplain why your solution works and describe one boundary case you tried.\n"
  }
];
