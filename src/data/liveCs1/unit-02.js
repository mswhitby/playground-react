// Public Computer Science I Unit 2 content copied from published classroom site.
export default [
  {
    "id": "02-values-and-variables/01-meet-variables",
    "unit": 2,
    "unitName": "Values, Variables & Expressions",
    "lesson": 1,
    "slug": "01-meet-variables",
    "title": "Names for changing information",
    "concept": "Variables and assignment  ",
    "summary": "Programs often need to remember data rather than typing it repeatedly. A variable is a name for a value.",
    "mode": "script",
    "starter": "# Name the player with a variable, then display the required message.\n",
    "cases": [
      {
        "expected": "Player: Nova"
      }
    ],
    "points": 5,
    "hints": [
      "How do you store text in a variable?",
      "`print()` can accept a label and a variable separated by a comma.",
      "Check the space after the colon in the displayed output."
    ],
    "markdown": "02-values-and-variables/lessons/01-meet-variables.md",
    "language": "python",
    "markdownSource": "# Values, Variables & Expressions — Lesson 1: Names for changing information\n\n**New skill:** Variables and assignment  \n**Previously learned:** Unit 01 — output, execution, and debugging\n\n## Why this matters\n\nPrograms often need to remember data rather than typing it repeatedly. A variable is a name for a value.\n\n## Study this example\n\n```python\nplayer = 'Nova'\nprint('Player:', player)\nplayer = 'Atlas'\nprint('Player:', player)\n```\n\nAssignment uses a single equals sign. Python uses the current value when it reaches each print statement. Renaming the player changes later output, not previous output.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nWhat does the second print statement show? Why?\n\n## Common mistake\n\nText values require quotation marks, but variable names do not.\n\n## Practice: Names for changing information\n\nCreate a variable named `player` storing the text `Nova`. Display exactly `Player: Nova` using the variable and `print()`.\n\n**Expected console output**\n\n```text\nPlayer: Nova\n```\n\n**Starter file:** [`main.py`](../practice/01-meet-variables/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nHow do you store text in a variable?\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\n`print()` can accept a label and a variable separated by a comma.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nCheck the space after the colon in the displayed output.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  },
  {
    "id": "02-values-and-variables/02-numbers-and-operations",
    "unit": 2,
    "unitName": "Values, Variables & Expressions",
    "lesson": 2,
    "slug": "02-numbers-and-operations",
    "title": "Calculate with numbers",
    "concept": "Integer arithmetic  ",
    "summary": "Unlike strings, integers support calculations. Python evaluates arithmetic expressions before producing output.",
    "mode": "script",
    "starter": "# How many minutes are spent in three sessions?\nsessions = 3\nminutes = 45\n# Calculate and print the total.\n",
    "cases": [
      {
        "expected": "135"
      }
    ],
    "points": 5,
    "hints": [
      "Identify the operation that combines repeated equal durations.",
      "Use the two existing variables rather than printing 135 directly.",
      "`print()` should display the numeric result."
    ],
    "markdown": "02-values-and-variables/lessons/02-numbers-and-operations.md",
    "language": "python",
    "markdownSource": "# Values, Variables & Expressions — Lesson 2: Calculate with numbers\n\n**New skill:** Integer arithmetic  \n**Previously learned:** Unit 01 — output, execution, and debugging\n\n## Why this matters\n\nUnlike strings, integers support calculations. Python evaluates arithmetic expressions before producing output.\n\n## Study this example\n\n```python\nminutes = 30\nsessions = 4\nprint(minutes * sessions)\nprint(15 // 4)\nprint(15 % 4)\n```\n\n`*` multiplies. `//` gives a whole-number quotient; `%` gives a remainder. The result of 30 × 4 is 120. You can keep numbers in variables and compute when needed.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nPredict `7 * 6`, `17 // 5`, and `17 % 5` before running.\n\n## Common mistake\n\nQuoted numbers such as `'12'` are strings, not integers.\n\n## Practice: Calculate with numbers\n\nA robotics club runs `3` sessions lasting `45` minutes each. Use variables named `sessions` and `minutes` to calculate and print the **total number of minutes**: `135`.\n\n**Expected console output**\n\n```text\n135\n```\n\n**Starter file:** [`main.py`](../practice/02-numbers-and-operations/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nIdentify the operation that combines repeated equal durations.\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\nUse the two existing variables rather than printing 135 directly.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\n`print()` should display the numeric result.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  },
  {
    "id": "02-values-and-variables/03-types-and-conversion",
    "unit": 2,
    "unitName": "Values, Variables & Expressions",
    "lesson": 3,
    "slug": "03-types-and-conversion",
    "title": "Numbers aren't always text",
    "concept": "String, int, float, conversion  ",
    "summary": "Python gives values different types. Strings hold text; integers hold whole numbers; floats hold decimal numbers.",
    "mode": "script",
    "starter": "# Give the two variables their correct numeric types.\nquantity = 8\nprice = 2.5\n# Display each type name on its own line.\n",
    "cases": [
      {
        "expected": "int\nfloat"
      }
    ],
    "points": 10,
    "hints": [
      "Review `type(value).__name__` in the example.",
      "You need two print statements, in the correct order.",
      "Do not put quotation marks around the number 8."
    ],
    "markdown": "02-values-and-variables/lessons/03-types-and-conversion.md",
    "language": "python",
    "markdownSource": "# Values, Variables & Expressions — Lesson 3: Numbers aren't always text\n\n**New skill:** String, int, float, conversion  \n**Previously learned:** Unit 01 — output, execution, and debugging\n\n## Why this matters\n\nPython gives values different types. Strings hold text; integers hold whole numbers; floats hold decimal numbers.\n\n## Study this example\n\n```python\ncount = 6\nrate = 2.5\nprint(type(count).__name__)\nprint(type(rate).__name__)\nprint(int('8') + count)\n```\n\n`type()` identifies a value's type, and `.__name__` provides its readable name. `int('8')` turns a numeric string into an integer so arithmetic works.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nWhat happens if you try `'8' + 6` without conversion?\n\n## Common mistake\n\n`'5' + '2'` joins strings into `'52'`, rather than adding them to get 7.\n\n## Practice: Numbers aren't always text\n\nSet `quantity = 8` as an integer and `price = 2.5` as a float. Print the type name of `quantity` on the first line and the type name of `price` on the second. The output must be exactly `int` then `float`.\n\n**Expected console output**\n\n```text\nint\nfloat\n```\n\n**Starter file:** [`main.py`](../practice/03-types-and-conversion/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nReview `type(value).__name__` in the example.\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\nYou need two print statements, in the correct order.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nDo not put quotation marks around the number 8.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  },
  {
    "id": "02-values-and-variables/04-build-a-price-calculator",
    "unit": 2,
    "unitName": "Values, Variables & Expressions",
    "lesson": 4,
    "slug": "04-build-a-price-calculator",
    "title": "Ticket Cost",
    "concept": "Variables and expressions together  ",
    "summary": "Real programs calculate new information using values they've stored. This mini-project applies your variable and arithmetic skills.",
    "mode": "script",
    "starter": "# Build a small price calculator with variables.\npasses = 4\nprice = 12\n# Compute the result and print the labeled total.\n",
    "cases": [
      {
        "expected": "Total: 48"
      }
    ],
    "points": 15,
    "hints": [
      "Multiply the number of passes by the price.",
      "You can store the calculation in a `total` variable.",
      "Print a label and the computed value in a single statement."
    ],
    "markdown": "02-values-and-variables/lessons/04-build-a-price-calculator.md",
    "language": "python",
    "markdownSource": "# Values, Variables & Expressions — Lesson 4: Build: Ticket Cost\n\n**New skill:** Variables and expressions together  \n**Previously learned:** Unit 01 — output, execution, and debugging\n\n## Why this matters\n\nReal programs calculate new information using values they've stored. This mini-project applies your variable and arithmetic skills.\n\n## Study this example\n\n```python\nitems = 2\ncost_each = 7\nsubtotal = items * cost_each\nprint('Subtotal:', subtotal)\n```\n\nThe variable `subtotal` captures a calculated value, making the code clearer and easier to change. Notice that print separates the label and number with a space.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nIf `items` becomes 5, which line must change?\n\n## Common mistake\n\nDo not hardcode the answer when you can calculate from the given variables.\n\n## Practice: Build: Ticket Cost\n\nA club sells `4` passes at `$12` each. Define variables `passes` and `price`, calculate the total, and display exactly `Total: 48`.\n\n**Expected console output**\n\n```text\nTotal: 48\n```\n\n**Starter file:** [`main.py`](../practice/04-build-a-price-calculator/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nMultiply the number of passes by the price.\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\nYou can store the calculation in a `total` variable.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nPrint a label and the computed value in a single statement.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  }
];
