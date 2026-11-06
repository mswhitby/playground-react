// Public Computer Science I Unit 4 content copied from published classroom site.
export default [
  {
    "id": "04-comparisons-and-boolean-logic/01-comparisons",
    "unit": 4,
    "unitName": "Comparisons & Boolean Logic",
    "lesson": 1,
    "slug": "01-comparisons",
    "title": "Ask Python a question",
    "concept": "Comparison operators and Boolean values  ",
    "summary": "A comparison is a question that evaluates to a Boolean value: `True` or `False`.",
    "mode": "function",
    "starter": "def has_required_points(current, required):\n    # Return whether current meets or exceeds required.\n    pass\n",
    "cases": [
      {
        "call": "has_required_points(8, 5)",
        "expected": "True"
      },
      {
        "call": "has_required_points(5, 5)",
        "expected": "True"
      },
      {
        "call": "has_required_points(4, 5)",
        "expected": "False"
      }
    ],
    "points": 5,
    "hints": [
      "Which operator means greater than **or equal to**?",
      "A comparison already produces `True` or `False`.",
      "Return the result of the comparison."
    ],
    "markdown": "04-comparisons-and-boolean-logic/lessons/01-comparisons.md",
    "functionName": "has_required_points",
    "language": "python",
    "markdownSource": "# Comparisons & Boolean Logic — Lesson 1: Ask Python a question\n\n**New skill:** Comparison operators and Boolean values  \n**Previously learned:** Unit 03 — parameters and return values\n\n## Why this matters\n\nA comparison is a question that evaluates to a Boolean value: `True` or `False`.\n\n## Study this example\n\n```python\nprint(7 > 3)\nprint(4 == 4)\nprint(2 != 2)\n```\n\n`>` asks whether one value is larger. `==` checks equality. `!=` checks inequality. The result is a Boolean, not the string `'True'`.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nPredict `5 >= 5` and `5 > 5`.\n\n## Common mistake\n\nUse `==` for comparison and `=` for assignment.\n\n## Practice: Ask Python a question\n\nComplete `has_required_points(current, required)` to return `True` if the current score is at least the required score, or `False` otherwise.\n\n**Example 1 — Input**\n\n```python\nhas_required_points(8, 5)\n```\n\n**Output**\n\n```python\nTrue\n```\n\n**Example 2 — Input**\n\n```python\nhas_required_points(5, 5)\n```\n\n**Output**\n\n```python\nTrue\n```\n\n**Example 3 — Input**\n\n```python\nhas_required_points(4, 5)\n```\n\n**Output**\n\n```python\nFalse\n```\n\n**Starter file:** [`main.py`](../practice/01-comparisons/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nWhich operator means greater than **or equal to**?\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\nA comparison already produces `True` or `False`.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nReturn the result of the comparison.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  },
  {
    "id": "04-comparisons-and-boolean-logic/02-equality",
    "unit": 4,
    "unitName": "Comparisons & Boolean Logic",
    "lesson": 2,
    "slug": "02-equality",
    "title": "Exact matches matter",
    "concept": "Equality and inequality  ",
    "summary": "Some actions should only happen when two values match exactly.",
    "mode": "function",
    "starter": "def codes_match(expected_code, entered_code):\n    # Compare both strings without changing them.\n    pass\n",
    "cases": [
      {
        "call": "codes_match('AB7', 'AB7')",
        "expected": "True"
      },
      {
        "call": "codes_match('AB7', 'ab7')",
        "expected": "False"
      },
      {
        "call": "codes_match('', '')",
        "expected": "True"
      }
    ],
    "points": 5,
    "hints": [
      "String comparison is case-sensitive by default.",
      "Use the equality operator.",
      "Return a Boolean, not a text message."
    ],
    "markdown": "04-comparisons-and-boolean-logic/lessons/02-equality.md",
    "functionName": "codes_match",
    "language": "python",
    "markdownSource": "# Comparisons & Boolean Logic — Lesson 2: Exact matches matter\n\n**New skill:** Equality and inequality  \n**Previously learned:** Unit 03 — parameters and return values\n\n## Why this matters\n\nSome actions should only happen when two values match exactly.\n\n## Study this example\n\n```python\nentered = 'UP'\ncorrect = 'UP'\nprint(entered == correct)\nprint(entered != 'up')\n```\n\nString equality is case-sensitive. `'UP'` equals `'UP'`, but it does not equal `'up'`.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nWould a string password match if its capitalization changes?\n\n## Common mistake\n\nAvoid confusing assignment (`=`) and equality (`==`).\n\n## Practice: Exact matches matter\n\nComplete `codes_match(expected_code, entered_code)` so it returns a Boolean indicating whether the two strings match exactly.\n\n**Example 1 — Input**\n\n```python\ncodes_match('AB7', 'AB7')\n```\n\n**Output**\n\n```python\nTrue\n```\n\n**Example 2 — Input**\n\n```python\ncodes_match('AB7', 'ab7')\n```\n\n**Output**\n\n```python\nFalse\n```\n\n**Example 3 — Input**\n\n```python\ncodes_match('', '')\n```\n\n**Output**\n\n```python\nTrue\n```\n\n**Starter file:** [`main.py`](../practice/02-equality/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nString comparison is case-sensitive by default.\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\nUse the equality operator.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nReturn a Boolean, not a text message.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  },
  {
    "id": "04-comparisons-and-boolean-logic/03-and-or-not",
    "unit": 4,
    "unitName": "Comparisons & Boolean Logic",
    "lesson": 3,
    "slug": "03-and-or-not",
    "title": "Combine conditions",
    "concept": "Logical operators  ",
    "summary": "Real decisions often require more than one condition. Python combines Boolean expressions with `and`, `or`, and `not`.",
    "mode": "function",
    "starter": "def can_send_notification(online, muted):\n    # Combine both Boolean inputs.\n    pass\n",
    "cases": [
      {
        "call": "can_send_notification(True, False)",
        "expected": "True"
      },
      {
        "call": "can_send_notification(True, True)",
        "expected": "False"
      },
      {
        "call": "can_send_notification(False, False)",
        "expected": "False"
      }
    ],
    "points": 10,
    "hints": [
      "Both online and not muted must be true.",
      "`not` reverses the muted flag.",
      "Combine the conditions with `and`."
    ],
    "markdown": "04-comparisons-and-boolean-logic/lessons/03-and-or-not.md",
    "functionName": "can_send_notification",
    "language": "python",
    "markdownSource": "# Comparisons & Boolean Logic — Lesson 3: Combine conditions\n\n**New skill:** Logical operators  \n**Previously learned:** Unit 03 — parameters and return values\n\n## Why this matters\n\nReal decisions often require more than one condition. Python combines Boolean expressions with `and`, `or`, and `not`.\n\n## Study this example\n\n```python\nhas_pass = True\nis_late = False\nprint(has_pass and not is_late)\nprint(has_pass or is_late)\n```\n\n`and` requires both sides to be true. `or` requires at least one side true. `not` reverses a Boolean.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nWould `False or True` be true? What about `True and False`?\n\n## Common mistake\n\nUse lowercase keywords `and`, `or`, `not`, but capitalized Boolean values `True` and `False`.\n\n## Practice: Combine conditions\n\nComplete `can_send_notification(online, muted)` to return `True` only when the player is online **and not muted**.\n\n**Example 1 — Input**\n\n```python\ncan_send_notification(True, False)\n```\n\n**Output**\n\n```python\nTrue\n```\n\n**Example 2 — Input**\n\n```python\ncan_send_notification(True, True)\n```\n\n**Output**\n\n```python\nFalse\n```\n\n**Example 3 — Input**\n\n```python\ncan_send_notification(False, False)\n```\n\n**Output**\n\n```python\nFalse\n```\n\n**Starter file:** [`main.py`](../practice/03-and-or-not/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nBoth online and not muted must be true.\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\n`not` reverses the muted flag.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nCombine the conditions with `and`.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  },
  {
    "id": "04-comparisons-and-boolean-logic/04-build-entry-check",
    "unit": 4,
    "unitName": "Comparisons & Boolean Logic",
    "lesson": 4,
    "slug": "04-build-entry-check",
    "title": "Entry Check",
    "concept": "Combining comparisons and logical operators  ",
    "summary": "An event app can decide whether a person qualifies based on a pass or an age threshold.",
    "mode": "function",
    "starter": "def can_enter_event(has_pass, age):\n    # Allow a valid pass OR meeting the age requirement.\n    pass\n",
    "cases": [
      {
        "call": "can_enter_event(True, 12)",
        "expected": "True"
      },
      {
        "call": "can_enter_event(False, 18)",
        "expected": "True"
      },
      {
        "call": "can_enter_event(False, 17)",
        "expected": "False"
      },
      {
        "call": "can_enter_event(False, 35)",
        "expected": "True"
      }
    ],
    "points": 15,
    "hints": [
      "Identify the two ways a person can qualify.",
      "Age must be compared to 18, including 18 itself.",
      "Join the two qualification conditions using `or`."
    ],
    "markdown": "04-comparisons-and-boolean-logic/lessons/04-build-entry-check.md",
    "functionName": "can_enter_event",
    "language": "python",
    "markdownSource": "# Comparisons & Boolean Logic — Lesson 4: Build: Entry Check\n\n**New skill:** Combining comparisons and logical operators  \n**Previously learned:** Unit 03 — parameters and return values\n\n## Why this matters\n\nAn event app can decide whether a person qualifies based on a pass or an age threshold.\n\n## Study this example\n\n```python\ndef can_watch(age, has_ticket):\n    return age >= 13 and has_ticket\n```\n\nThe comparison `age >= 13` returns a Boolean. `and` combines that with the second Boolean parameter.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nDoes the sample function allow a twelve-year-old with a ticket?\n\n## Common mistake\n\nBe explicit about whether the rule requires both conditions or only one.\n\n## Practice: Build: Entry Check\n\nComplete `can_enter_event(has_pass, age)` so entry is allowed (`True`) if the person has a pass **or** is at least `18` years old. Otherwise return `False`.\n\n**Example 1 — Input**\n\n```python\ncan_enter_event(True, 12)\n```\n\n**Output**\n\n```python\nTrue\n```\n\n**Example 2 — Input**\n\n```python\ncan_enter_event(False, 18)\n```\n\n**Output**\n\n```python\nTrue\n```\n\n**Example 3 — Input**\n\n```python\ncan_enter_event(False, 17)\n```\n\n**Output**\n\n```python\nFalse\n```\n\n**Example 4 — Input**\n\n```python\ncan_enter_event(False, 35)\n```\n\n**Output**\n\n```python\nTrue\n```\n\n**Starter file:** [`main.py`](../practice/04-build-entry-check/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nIdentify the two ways a person can qualify.\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\nAge must be compared to 18, including 18 itself.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nJoin the two qualification conditions using `or`.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  }
];
