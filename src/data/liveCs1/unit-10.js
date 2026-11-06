// Public Computer Science I Unit 10 content copied from published classroom site.
export default [
  {
    "id": "10-algorithms-and-testing/01-while-and-sentinels",
    "unit": 10,
    "unitName": "Algorithms & Testing",
    "lesson": 1,
    "slug": "01-while-and-sentinels",
    "title": "Repeat until a stop signal",
    "concept": "While loops and sentinel values",
    "summary": "A `while` loop repeats until a condition changes, making it useful when the stopping point is part of the input.",
    "mode": "function",
    "starter": "def before_stop(events):\n    # Count items until the sentinel 'stop' or the end.\n    pass\n",
    "cases": [
      {
        "call": "before_stop(['tap', 'tap', 'stop', 'tap'])",
        "expected": "2"
      },
      {
        "call": "before_stop(['stop', 'tap'])",
        "expected": "0"
      },
      {
        "call": "before_stop(['a', 'b'])",
        "expected": "2"
      },
      {
        "call": "before_stop([])",
        "expected": "0"
      }
    ],
    "points": 10,
    "hints": [
      "Begin an index or counter at zero.",
      "While the index is in bounds and the current value is not `'stop'`, move forward.",
      "Return the number of events visited."
    ],
    "markdown": "10-algorithms-and-testing/lessons/01-while-and-sentinels.md",
    "functionName": "before_stop",
    "language": "python",
    "markdownSource": "# Algorithms & Testing — Lesson 1: Repeat until a stop signal\n\n**New skill:** While loops and sentinel values  \n**Previously learned:** Units 01–09\n\n## Why this matters\n\nApps process a sequence of events until a logout, shutdown, or special signal.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nevents = ['tap', 'tap', 'stop', 'tap']\nindex = 0\nwhile index < len(events) and events[index] != 'stop':\n    index += 1\nprint(index)\n```\n\n## Step 2 — Trace the code\n\n1. Track the index that tells the loop which item to inspect.\n2. Use `and` so you never index past the end of the list.\n3. Stop before processing the special text `'stop'`.\n\n## Step 3 — Check your understanding\n\nHow many events occur before `'stop'` in `['a', 'b', 'stop', 'c']`?\n\n## Step 4 — Watch for this mistake\n\nA while loop can run forever when you forget to update the variable in its condition.\n\n## Practice: Repeat until a stop signal\n\nComplete `before_stop(events)` to return how many values appear before the first `'stop'`. If no stop signal appears, count the entire list.\n\n**Function contract:** `before_stop(events)`  \n**Starter file:** [`main.py`](../../practice/01-while-and-sentinels/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nBegin an index or counter at zero.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nWhile the index is in bounds and the current value is not `'stop'`, move forward.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nReturn the number of events visited.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "10-algorithms-and-testing/02-decompose-a-problem",
    "unit": 10,
    "unitName": "Algorithms & Testing",
    "lesson": 2,
    "slug": "02-decompose-a-problem",
    "title": "Break a problem into helper functions",
    "concept": "Decomposition, pure functions",
    "summary": "Small functions can each handle one responsibility and work together to solve a larger task.",
    "mode": "function",
    "starter": "def total_with_bonus(scores, bonus):\n    # Add positive scores only, then include the bonus.\n    pass\n",
    "cases": [
      {
        "call": "total_with_bonus([8, -2, 5], 3)",
        "expected": "16"
      },
      {
        "call": "total_with_bonus([], 10)",
        "expected": "10"
      },
      {
        "call": "total_with_bonus([-4, 0], 2)",
        "expected": "2"
      },
      {
        "call": "total_with_bonus([1, 2, 3], 0)",
        "expected": "6"
      }
    ],
    "points": 10,
    "hints": [
      "Start a total at zero.",
      "Only add a score when it is greater than zero.",
      "Return the total plus the bonus after the loop."
    ],
    "markdown": "10-algorithms-and-testing/lessons/02-decompose-a-problem.md",
    "functionName": "total_with_bonus",
    "language": "python",
    "markdownSource": "# Algorithms & Testing — Lesson 2: Break a problem into helper functions\n\n**New skill:** Decomposition, pure functions  \n**Previously learned:** Units 01–09\n\n## Why this matters\n\nLarge apps become easier to debug when their calculation rules are separated into reusable pieces.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\ndef nonnegative(value):\n    return max(0, value)\n\ndef total_points(scores):\n    total = 0\n    for score in scores:\n        total += nonnegative(score)\n    return total\n\nprint(total_points([8, -2, 5]))\n```\n\n## Step 2 — Trace the code\n\n1. Read the helper's contract: negative numbers become zero.\n2. Trace how the main function calls the helper for each item.\n3. Combine helper results into a total rather than writing one giant expression.\n\n## Step 3 — Check your understanding\n\nWhat does `total_points([-2, -1, 7])` return?\n\n## Step 4 — Watch for this mistake\n\nDo not forget the `return` statement in either function. A missing return produces `None`.\n\n## Practice: Break a problem into helper functions\n\nComplete `total_with_bonus(scores, bonus)` to sum only positive scores, then add `bonus`. Zero and negative scores contribute nothing. You may create helper functions.\n\n**Function contract:** `total_with_bonus(scores, bonus)`  \n**Starter file:** [`main.py`](../../practice/02-decompose-a-problem/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nStart a total at zero.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nOnly add a score when it is greater than zero.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nReturn the total plus the bonus after the loop.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "10-algorithms-and-testing/03-search-for-a-match",
    "unit": 10,
    "unitName": "Algorithms & Testing",
    "lesson": 3,
    "slug": "03-search-for-a-match",
    "title": "Find the first matching position",
    "concept": "Linear search and enumerate",
    "summary": "A linear search visits items in order and stops once it finds the first matching value.",
    "mode": "function",
    "starter": "def first_position(values, target):\n    # Search in order and return the first matching index.\n    pass\n",
    "cases": [
      {
        "call": "first_position(['Ava', 'Kai', 'Ava'], 'Ava')",
        "expected": "0"
      },
      {
        "call": "first_position([2, 5, 2], 5)",
        "expected": "1"
      },
      {
        "call": "first_position([], 'x')",
        "expected": "-1"
      },
      {
        "call": "first_position(['a', 'b'], 'z')",
        "expected": "-1"
      }
    ],
    "points": 10,
    "hints": [
      "Loop using `enumerate(values)`.",
      "Return the index as soon as the value matches.",
      "Return -1 after checking every item without a match."
    ],
    "markdown": "10-algorithms-and-testing/lessons/03-search-for-a-match.md",
    "functionName": "first_position",
    "language": "python",
    "markdownSource": "# Algorithms & Testing — Lesson 3: Find the first matching position\n\n**New skill:** Linear search and enumerate  \n**Previously learned:** Units 01–09\n\n## Why this matters\n\nSearch underlies app menus, student rosters, and debugging lists of events.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nnames = ['Ava', 'Kai', 'Ava']\nfor index, name in enumerate(names):\n    if name == 'Kai':\n        print(index)\n        break\n```\n\n## Step 2 — Trace the code\n\n1. Use `enumerate()` when you need both the index and the value.\n2. Compare each item with the target using `==`.\n3. Return immediately on a match, otherwise return -1 after the loop.\n\n## Step 3 — Check your understanding\n\nWhat index should a search return for the first `'Ava'`? What if the name is missing?\n\n## Step 4 — Watch for this mistake\n\nA `return -1` placed inside the loop ends the search after checking only the first item.\n\n## Practice: Find the first matching position\n\nComplete `first_position(values, target)` to return the index of the first equal value, or -1 when not found.\n\n**Function contract:** `first_position(values, target)`  \n**Starter file:** [`main.py`](../../practice/03-search-for-a-match/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nLoop using `enumerate(values)`.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nReturn the index as soon as the value matches.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nReturn -1 after checking every item without a match.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "10-algorithms-and-testing/04-build-an-event-report",
    "unit": 10,
    "unitName": "Algorithms & Testing",
    "lesson": 4,
    "slug": "04-build-an-event-report",
    "title": "Build a data-informed event report",
    "concept": "Counting, sorting, formatting and testing",
    "summary": "Turn raw event records into a consistent, readable summary using several Python skills together.",
    "mode": "function",
    "starter": "def event_report(events):\n    # Count events, sort the labels, and return one report string.\n    pass\n",
    "cases": [
      {
        "call": "event_report(['run', 'jump', 'run'])",
        "expected": "'jump:1 | run:2'"
      },
      {
        "call": "event_report([])",
        "expected": "''"
      },
      {
        "call": "event_report(['tap'])",
        "expected": "'tap:1'"
      },
      {
        "call": "event_report(['b', 'a', 'b', 'c', 'a'])",
        "expected": "'a:2 | b:2 | c:1'"
      }
    ],
    "points": 20,
    "hints": [
      "Build a dictionary of counts using `.get()`.",
      "Use `sorted(counts)` to visit names alphabetically.",
      "Create strings `name + ':' + str(count)` and join them using `' | '`."
    ],
    "markdown": "10-algorithms-and-testing/lessons/04-build-an-event-report.md",
    "functionName": "event_report",
    "language": "python",
    "markdownSource": "# Algorithms & Testing — Lesson 4: Build a data-informed event report\n\n**New skill:** Counting, sorting, formatting and testing  \n**Previously learned:** Units 01–09\n\n## Why this matters\n\nReal apps do more than count data: they communicate what happened in a format people can use.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\ncounts = {'jump': 1, 'run': 2}\nparts = []\nfor key in sorted(counts):\n    parts.append(key + ':' + str(counts[key]))\nprint(' | '.join(parts))\n```\n\n## Step 2 — Trace the code\n\n1. Build a frequency table while visiting the event list.\n2. Sort keys alphabetically for predictable output.\n3. Convert counts into strings and join labeled pieces using the exact separator.\n\n## Step 3 — Check your understanding\n\nPredict how `['jump', 'run', 'run']` becomes the text `jump:1 | run:2`.\n\n## Step 4 — Watch for this mistake\n\nDictionary insertion order is not the same as alphabetical order. Explicitly sort keys for the report.\n\n## Practice: Build a data-informed event report\n\nComplete `event_report(events)` to return alphabetically ordered `label:count` pairs separated by ` | `. Return the empty string for an empty input.\n\n**Function contract:** `event_report(events)`  \n**Starter file:** [`main.py`](../../practice/04-build-an-event-report/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nBuild a dictionary of counts using `.get()`.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nUse `sorted(counts)` to visit names alphabetically.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nCreate strings `name + ':' + str(count)` and join them using `' | '`.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  }
];
