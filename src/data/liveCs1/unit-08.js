// Public Computer Science I Unit 8 content copied from published classroom site.
export default [
  {
    "id": "08-lists-and-collections/01-list-indexing",
    "unit": 8,
    "unitName": "Lists & Collections",
    "lesson": 1,
    "slug": "01-list-indexing",
    "title": "Read values from a list",
    "concept": "Lists, indexes, negative positions",
    "summary": "A list stores several values in order, and each can be read using its position.",
    "mode": "function",
    "starter": "def end_points(values):\n    # Return a new two-item list, not the original list.\n    pass\n",
    "cases": [
      {
        "call": "end_points([4, 7, 9])",
        "expected": "[4, 9]"
      },
      {
        "call": "end_points([2])",
        "expected": "[2, 2]"
      },
      {
        "call": "end_points(['a', 'b'])",
        "expected": "['a', 'b']"
      },
      {
        "call": "end_points([0, -1, 3, 8])",
        "expected": "[0, 8]"
      }
    ],
    "points": 5,
    "hints": [
      "Select the value at index 0.",
      "Use index -1 for the final value.",
      "Wrap the two values in square brackets."
    ],
    "markdown": "08-lists-and-collections/lessons/01-list-indexing.md",
    "functionName": "end_points",
    "language": "python",
    "markdownSource": "# Lists & Collections — Lesson 1: Read values from a list\n\n**New skill:** Lists, indexes, negative positions  \n**Previously learned:** Units 01–07\n\n## Why this matters\n\nScores, sensor readings, and attendance check-ins often arrive as groups of values.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nscores = [8, 12, 15]\nprint(scores[0])\nprint(scores[-1])\nprint(len(scores))\n```\n\n## Step 2 — Trace the code\n\n1. Find the square brackets that group values into one list.\n2. Identify the first item at index 0 and the last with index -1.\n3. Use `len()` to count items, not the characters inside them.\n\n## Step 3 — Check your understanding\n\nWhat does `[5, 10, 15, 20][1]` return?\n\n## Step 4 — Watch for this mistake\n\nA list of three items has indexes 0, 1 and 2. Its last item is not at index 3.\n\n## Practice: Read values from a list\n\nComplete `end_points(values)` to return a two-item list containing the first and last input items. The input always contains at least one item.\n\n**Function contract:** `end_points(values)`  \n**Starter file:** [`main.py`](../../practice/01-list-indexing/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nSelect the value at index 0.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nUse index -1 for the final value.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nWrap the two values in square brackets.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "08-lists-and-collections/02-copy-and-change",
    "unit": 8,
    "unitName": "Lists & Collections",
    "lesson": 2,
    "slug": "02-copy-and-change",
    "title": "Update a copy, not the original",
    "concept": "List copying and assignment",
    "summary": "Lists are mutable, so programs should decide carefully whether to change the caller's data or return a modified copy.",
    "mode": "function",
    "starter": "def replace_last(items, value):\n    # Make a copy, edit the copy, then return it.\n    pass\n",
    "cases": [
      {
        "call": "replace_last([2, 4, 6], 8)",
        "expected": "[2, 4, 8]"
      },
      {
        "call": "replace_last(['old'], 'new')",
        "expected": "['new']"
      },
      {
        "call": "replace_last([0, 0], 3)",
        "expected": "[0, 3]"
      },
      {
        "call": "replace_last(['a', 'b'], 'z')",
        "expected": "['a', 'z']"
      }
    ],
    "points": 10,
    "hints": [
      "Use `items.copy()` first.",
      "Update position -1 in the copied list.",
      "Return the copy."
    ],
    "markdown": "08-lists-and-collections/lessons/02-copy-and-change.md",
    "functionName": "replace_last",
    "language": "python",
    "markdownSource": "# Lists & Collections — Lesson 2: Update a copy, not the original\n\n**New skill:** List copying and assignment  \n**Previously learned:** Units 01–07\n\n## Why this matters\n\nA class app might preview edited settings without overwriting the original choices.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\noriginal = ['red', 'blue']\nupdated = original.copy()\nupdated[-1] = 'green'\nprint(original)\nprint(updated)\n```\n\n## Step 2 — Trace the code\n\n1. Create a new list with `.copy()`.\n2. Assign a new value at an existing index.\n3. Confirm that the original list still has its previous value.\n\n## Step 3 — Check your understanding\n\nIf `a = [1, 2]` and `b = a`, what changes when `b[0] = 9`? Compare with `.copy()`.\n\n## Step 4 — Watch for this mistake\n\n`copy = items` gives two names to the same list. It does not make an independent copy.\n\n## Practice: Update a copy, not the original\n\nComplete `replace_last(items, value)` to return a new list with its final item replaced. Do not modify `items`. The list is nonempty.\n\n**Function contract:** `replace_last(items, value)`  \n**Starter file:** [`main.py`](../../practice/02-copy-and-change/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nUse `items.copy()` first.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nUpdate position -1 in the copied list.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nReturn the copy.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "08-lists-and-collections/03-filter-a-list",
    "unit": 8,
    "unitName": "Lists & Collections",
    "lesson": 3,
    "slug": "03-filter-a-list",
    "title": "Keep values that meet a rule",
    "concept": "For loops, if statements, accumulators",
    "summary": "A loop can inspect a collection and build a new list containing only matching items.",
    "mode": "function",
    "starter": "def positive_values(numbers):\n    # Keep positive numbers in a new list.\n    pass\n",
    "cases": [
      {
        "call": "positive_values([-2, 7, 0, 4])",
        "expected": "[7, 4]"
      },
      {
        "call": "positive_values([])",
        "expected": "[]"
      },
      {
        "call": "positive_values([-5, -1])",
        "expected": "[]"
      },
      {
        "call": "positive_values([3, 2, 1])",
        "expected": "[3, 2, 1]"
      }
    ],
    "points": 10,
    "hints": [
      "Begin with an empty list.",
      "Use a `for` loop over the input list.",
      "Append only when the value is strictly greater than zero."
    ],
    "markdown": "08-lists-and-collections/lessons/03-filter-a-list.md",
    "functionName": "positive_values",
    "language": "python",
    "markdownSource": "# Lists & Collections — Lesson 3: Keep values that meet a rule\n\n**New skill:** For loops, if statements, accumulators  \n**Previously learned:** Units 01–07\n\n## Why this matters\n\nApps filter notifications, positive readings, and completed tasks using the same pattern.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nnumbers = [-2, 7, 0, 4]\npositive = []\nfor number in numbers:\n    if number > 0:\n        positive.append(number)\nprint(positive)\n```\n\n## Step 2 — Trace the code\n\n1. Start with an empty result list.\n2. Visit each input value using a `for` loop.\n3. Append a value only when its condition is true.\n\n## Step 3 — Check your understanding\n\nFor `[-1, 0, 2]`, which values pass `number > 0`?\n\n## Step 4 — Watch for this mistake\n\n`.append()` changes an existing list. Calling it does not return the updated list.\n\n## Practice: Keep values that meet a rule\n\nComplete `positive_values(numbers)` to return a new list containing only numbers greater than zero, in their original order.\n\n**Function contract:** `positive_values(numbers)`  \n**Starter file:** [`main.py`](../../practice/03-filter-a-list/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nBegin with an empty list.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nUse a `for` loop over the input list.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nAppend only when the value is strictly greater than zero.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "08-lists-and-collections/04-build-a-leaderboard",
    "unit": 8,
    "unitName": "Lists & Collections",
    "lesson": 4,
    "slug": "04-build-a-leaderboard",
    "title": "Build a score leaderboard",
    "concept": "Sorted lists, reverse order and preserving data",
    "summary": "A leaderboard orders numeric scores while leaving the original score list unchanged.",
    "mode": "function",
    "starter": "def top_two(scores):\n    # Return two highest scores without modifying the input.\n    pass\n",
    "cases": [
      {
        "call": "top_two([12, 28, 19])",
        "expected": "[28, 19]"
      },
      {
        "call": "top_two([9, 9, 3])",
        "expected": "[9, 9]"
      },
      {
        "call": "top_two([-3, -1, -5])",
        "expected": "[-1, -3]"
      },
      {
        "call": "top_two([4, 2])",
        "expected": "[4, 2]"
      }
    ],
    "points": 15,
    "hints": [
      "Make a descending copy with `sorted()`.",
      "Use `reverse=True` rather than manually swapping values.",
      "Return a slice containing the first two items."
    ],
    "markdown": "08-lists-and-collections/lessons/04-build-a-leaderboard.md",
    "functionName": "top_two",
    "language": "python",
    "markdownSource": "# Lists & Collections — Lesson 4: Build a score leaderboard\n\n**New skill:** Sorted lists, reverse order and preserving data  \n**Previously learned:** Units 01–07\n\n## Why this matters\n\nSorting is useful for game rankings, robotics competitions, and class progress views.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nscores = [12, 28, 19]\nranked = sorted(scores, reverse=True)\nprint(ranked)\nprint(scores)\n```\n\n## Step 2 — Trace the code\n\n1. Use `sorted()` to create a new ordered list.\n2. Set `reverse=True` to put larger values first.\n3. Use a slice to select only the two top results.\n\n## Step 3 — Check your understanding\n\nWhat are the first two values of `sorted([7, 9, 9, 3], reverse=True)`?\n\n## Step 4 — Watch for this mistake\n\n`.sort()` changes a list in place and returns `None`; `sorted()` creates a new list.\n\n## Practice: Build a score leaderboard\n\nComplete `top_two(scores)` to return the two highest scores in descending order. Duplicates count. There will be at least two scores.\n\n**Function contract:** `top_two(scores)`  \n**Starter file:** [`main.py`](../../practice/04-build-a-leaderboard/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nMake a descending copy with `sorted()`.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nUse `reverse=True` rather than manually swapping values.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nReturn a slice containing the first two items.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  }
];
