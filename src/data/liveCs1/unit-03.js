// Public Computer Science I Unit 3 content copied from published classroom site.
export default [
  {
    "id": "03-functions-and-parameters/01-functions-return",
    "unit": 3,
    "unitName": "Functions, Parameters & Return Values",
    "lesson": 1,
    "slug": "01-functions-return",
    "title": "Returning an answer",
    "concept": "Function definitions and return  ",
    "summary": "A function packages instructions into a reusable operation. A function can give a result back with `return`.",
    "mode": "function",
    "starter": "def increment_number(number):\n    # Return the number that comes immediately after this one.\n    pass\n",
    "cases": [
      {
        "call": "increment_number(4)",
        "expected": "5"
      },
      {
        "call": "increment_number(-1)",
        "expected": "0"
      },
      {
        "call": "increment_number(99)",
        "expected": "100"
      }
    ],
    "points": 5,
    "hints": [
      "The input arrives in a parameter called `number`.",
      "Use addition with the value given to you.",
      "The grader needs `return`, not `print`."
    ],
    "markdown": "03-functions-and-parameters/lessons/01-functions-return.md",
    "functionName": "increment_number",
    "language": "python",
    "markdownSource": "# Functions, Parameters & Return Values — Lesson 1: Returning an answer\n\n**New skill:** Function definitions and return  \n**Previously learned:** Unit 02 — data types, variables, expressions\n\n## Why this matters\n\nA function packages instructions into a reusable operation. A function can give a result back with `return`.\n\n## Study this example\n\n```python\ndef double(n):\n    return n * 2\n\nprint(double(4))\n```\n\n`def` starts a function definition. Its indented body runs when called. `return` gives a value to the caller. A function with no explicit return produces `None`.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nHow does `double(7)` differ from printing the number 14 inside the function?\n\n## Common mistake\n\nPrinting a value is not the same as returning it.\n\n## Practice: Returning an answer\n\nComplete `increment_number(number)` so it returns `number + 1`, without printing the answer.\n\n**Example 1 — Input**\n\n```python\nincrement_number(4)\n```\n\n**Output**\n\n```python\n5\n```\n\n**Example 2 — Input**\n\n```python\nincrement_number(-1)\n```\n\n**Output**\n\n```python\n0\n```\n\n**Example 3 — Input**\n\n```python\nincrement_number(99)\n```\n\n**Output**\n\n```python\n100\n```\n\n**Starter file:** [`main.py`](../practice/01-functions-return/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nThe input arrives in a parameter called `number`.\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\nUse addition with the value given to you.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nThe grader needs `return`, not `print`.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  },
  {
    "id": "03-functions-and-parameters/02-parameters",
    "unit": 3,
    "unitName": "Functions, Parameters & Return Values",
    "lesson": 2,
    "slug": "02-parameters",
    "title": "Working with two inputs",
    "concept": "Parameters and arguments  ",
    "summary": "Functions can have more than one parameter. An argument is the actual value supplied for a parameter when a function is called.",
    "mode": "function",
    "starter": "def calculate_pay(hours, rate):\n    # Compute pay from the two given parameters.\n    pass\n",
    "cases": [
      {
        "call": "calculate_pay(3, 12)",
        "expected": "36"
      },
      {
        "call": "calculate_pay(0, 14)",
        "expected": "0"
      },
      {
        "call": "calculate_pay(2, 7.5)",
        "expected": "15.0"
      }
    ],
    "points": 5,
    "hints": [
      "Look at which parameter is hours and which is rate.",
      "A multiplication expression produces the total pay.",
      "Return the numeric answer."
    ],
    "markdown": "03-functions-and-parameters/lessons/02-parameters.md",
    "functionName": "calculate_pay",
    "language": "python",
    "markdownSource": "# Functions, Parameters & Return Values — Lesson 2: Working with two inputs\n\n**New skill:** Parameters and arguments  \n**Previously learned:** Unit 02 — data types, variables, expressions\n\n## Why this matters\n\nFunctions can have more than one parameter. An argument is the actual value supplied for a parameter when a function is called.\n\n## Study this example\n\n```python\ndef perimeter(width, height):\n    return 2 * (width + height)\n\nprint(perimeter(3, 5))\n```\n\nWhen called with `(3, 5)`, `width` is 3 and `height` is 5. The expression calculates the perimeter and returns 16.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nWhat would the example return for width 2 and height 4?\n\n## Common mistake\n\nDon't swap parameters accidentally when their positions have different meanings.\n\n## Practice: Working with two inputs\n\nComplete `calculate_pay(hours, rate)` to return the total pay calculated by multiplying hours by the hourly rate.\n\n**Example 1 — Input**\n\n```python\ncalculate_pay(3, 12)\n```\n\n**Output**\n\n```python\n36\n```\n\n**Example 2 — Input**\n\n```python\ncalculate_pay(0, 14)\n```\n\n**Output**\n\n```python\n0\n```\n\n**Example 3 — Input**\n\n```python\ncalculate_pay(2, 7.5)\n```\n\n**Output**\n\n```python\n15.0\n```\n\n**Starter file:** [`main.py`](../practice/02-parameters/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nLook at which parameter is hours and which is rate.\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\nA multiplication expression produces the total pay.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nReturn the numeric answer.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  },
  {
    "id": "03-functions-and-parameters/03-strings-from-functions",
    "unit": 3,
    "unitName": "Functions, Parameters & Return Values",
    "lesson": 3,
    "slug": "03-strings-from-functions",
    "title": "Return a string",
    "concept": "String expressions and return types  ",
    "summary": "Functions don't have to return numbers. A function can construct and return a message using text and its inputs.",
    "mode": "function",
    "starter": "def create_greeting(username):\n    # Build a welcome string using the argument.\n    pass\n",
    "cases": [
      {
        "call": "create_greeting('Riley')",
        "expected": "'Welcome, Riley!'"
      },
      {
        "call": "create_greeting('Kai')",
        "expected": "'Welcome, Kai!'"
      },
      {
        "call": "create_greeting('')",
        "expected": "'Welcome, !'"
      }
    ],
    "points": 10,
    "hints": [
      "You can join smaller strings with `+`.",
      "Use the parameter between the greeting and the exclamation mark.",
      "The result should be a string returned by the function."
    ],
    "markdown": "03-functions-and-parameters/lessons/03-strings-from-functions.md",
    "functionName": "create_greeting",
    "language": "python",
    "markdownSource": "# Functions, Parameters & Return Values — Lesson 3: Return a string\n\n**New skill:** String expressions and return types  \n**Previously learned:** Unit 02 — data types, variables, expressions\n\n## Why this matters\n\nFunctions don't have to return numbers. A function can construct and return a message using text and its inputs.\n\n## Study this example\n\n```python\ndef tag(name):\n    return 'Hi, ' + name\n\nprint(tag('Sam'))\n```\n\nThe `+` operator concatenates strings when both sides are text. The returned value has type `str`.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nWhy do you need the space after the comma in `'Hi, '`?\n\n## Common mistake\n\n`return 'Hi, name'` returns the literal word name, not the parameter's value.\n\n## Practice: Return a string\n\nComplete `create_greeting(username)` to return `Welcome, <username>!` with the actual username inserted. Preserve the exact punctuation.\n\n**Example 1 — Input**\n\n```python\ncreate_greeting('Riley')\n```\n\n**Output**\n\n```python\n'Welcome, Riley!'\n```\n\n**Example 2 — Input**\n\n```python\ncreate_greeting('Kai')\n```\n\n**Output**\n\n```python\n'Welcome, Kai!'\n```\n\n**Example 3 — Input**\n\n```python\ncreate_greeting('')\n```\n\n**Output**\n\n```python\n'Welcome, !'\n```\n\n**Starter file:** [`main.py`](../practice/03-strings-from-functions/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nYou can join smaller strings with `+`.\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\nUse the parameter between the greeting and the exclamation mark.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nThe result should be a string returned by the function.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  },
  {
    "id": "03-functions-and-parameters/04-build-area-tool",
    "unit": 3,
    "unitName": "Functions, Parameters & Return Values",
    "lesson": 4,
    "slug": "04-build-area-tool",
    "title": "Rectangle Area Tool",
    "concept": "Reusable functions and expressions  ",
    "summary": "A classroom design app needs a reusable calculation rather than manually recalculating the area of every rectangle.",
    "mode": "function",
    "starter": "def calculate_rectangle_area(width, height):\n    # Return the area based on the supplied dimensions.\n    pass\n",
    "cases": [
      {
        "call": "calculate_rectangle_area(5, 3)",
        "expected": "15"
      },
      {
        "call": "calculate_rectangle_area(0, 10)",
        "expected": "0"
      },
      {
        "call": "calculate_rectangle_area(2.5, 4)",
        "expected": "10.0"
      }
    ],
    "points": 15,
    "hints": [
      "Area is width multiplied by height.",
      "Don't display output with `print()`.",
      "Return the calculated value directly or save it to a variable before returning."
    ],
    "markdown": "03-functions-and-parameters/lessons/04-build-area-tool.md",
    "functionName": "calculate_rectangle_area",
    "language": "python",
    "markdownSource": "# Functions, Parameters & Return Values — Lesson 4: Build: Rectangle Area Tool\n\n**New skill:** Reusable functions and expressions  \n**Previously learned:** Unit 02 — data types, variables, expressions\n\n## Why this matters\n\nA classroom design app needs a reusable calculation rather than manually recalculating the area of every rectangle.\n\n## Study this example\n\n```python\ndef square_area(side):\n    return side * side\n\nprint(square_area(5))\n```\n\nThe caller provides a value, and the function returns a result. One function works for many different input values.\n\nBefore moving on, trace each line of the example by hand. Predict the result before running it in the browser.\n\n## Check your understanding\n\nWhich parts of the function are general enough to work with a different square size?\n\n## Common mistake\n\nDo not hardcode the sample result; the checker will use additional arguments.\n\n## Practice: Build: Rectangle Area Tool\n\nComplete `calculate_rectangle_area(width, height)` to return the area of a rectangle (`width * height`). It must work with positive and zero dimensions.\n\n**Example 1 — Input**\n\n```python\ncalculate_rectangle_area(5, 3)\n```\n\n**Output**\n\n```python\n15\n```\n\n**Example 2 — Input**\n\n```python\ncalculate_rectangle_area(0, 10)\n```\n\n**Output**\n\n```python\n0\n```\n\n**Example 3 — Input**\n\n```python\ncalculate_rectangle_area(2.5, 4)\n```\n\n**Output**\n\n```python\n10.0\n```\n\n**Starter file:** [`main.py`](../practice/04-build-area-tool/main.py)\n\nUse **Run** to experiment and **Check** to compare against published examples. A passing public example does not automatically establish mastery.\n\n<details>\n<summary>Hint 1 — Identify the key concept</summary>\n\nArea is width multiplied by height.\n\n</details>\n\n<details>\n<summary>Hint 2 — Find an approach</summary>\n\nDon't display output with `print()`.\n\n</details>\n\n<details>\n<summary>Hint 3 — Check your answer</summary>\n\nReturn the calculated value directly or save it to a variable before returning.\n\n</details>\n\n## Reflection\n\nWrite a short explanation of **why** your code works. What input or change would make it behave differently?\n"
  }
];
