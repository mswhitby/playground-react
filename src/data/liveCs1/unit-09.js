// Public Computer Science I Unit 9 content copied from published classroom site.
export default [
  {
    "id": "09-dictionaries-and-data/01-keys-and-values",
    "unit": 9,
    "unitName": "Dictionaries & Data",
    "lesson": 1,
    "slug": "01-keys-and-values",
    "title": "Look up information by key",
    "concept": "Dictionary lookup and get",
    "summary": "Dictionaries connect unique keys with values, letting a program retrieve information by name.",
    "mode": "function",
    "starter": "def price_for(prices, item):\n    # Look up a price with a safe default.\n    pass\n",
    "cases": [
      {
        "call": "price_for({'pen': 2, 'book': 5}, 'book')",
        "expected": "5"
      },
      {
        "call": "price_for({'pen': 2}, 'eraser')",
        "expected": "0"
      },
      {
        "call": "price_for({}, 'missing')",
        "expected": "0"
      },
      {
        "call": "price_for({'x': 0, 'y': 7}, 'x')",
        "expected": "0"
      }
    ],
    "points": 5,
    "hints": [
      "Use `.get()` on the dictionary.",
      "Pass `item` as the key.",
      "Use zero as the fallback value."
    ],
    "markdown": "09-dictionaries-and-data/lessons/01-keys-and-values.md",
    "functionName": "price_for",
    "language": "python",
    "markdownSource": "# Dictionaries & Data — Lesson 1: Look up information by key\n\n**New skill:** Dictionary lookup and get  \n**Previously learned:** Units 01–08\n\n## Why this matters\n\nApps use lookup tables for labels, inventory prices, and configuration values.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nprices = {'pen': 2, 'notebook': 5}\nprint(prices['pen'])\nprint(prices.get('eraser', 0))\n```\n\n## Step 2 — Trace the code\n\n1. Identify a key and its value in each key-value pair.\n2. Use square brackets when the key is known to exist.\n3. Use `.get(key, default)` to handle a key that may be missing.\n\n## Step 3 — Check your understanding\n\nWhat does `{'a': 3}.get('b', 0)` return, and why?\n\n## Step 4 — Watch for this mistake\n\nA missing key causes `KeyError` with square brackets, but `.get()` can supply a default.\n\n## Practice: Look up information by key\n\nComplete `price_for(prices, item)` to return the item's numeric price, or 0 if the item is not in the dictionary.\n\n**Function contract:** `price_for(prices, item)`  \n**Starter file:** [`main.py`](../../practice/01-keys-and-values/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nUse `.get()` on the dictionary.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nPass `item` as the key.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nUse zero as the fallback value.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "09-dictionaries-and-data/02-count-with-dictionaries",
    "unit": 9,
    "unitName": "Dictionaries & Data",
    "lesson": 2,
    "slug": "02-count-with-dictionaries",
    "title": "Count repeated events",
    "concept": "Frequency tables and dictionary updates",
    "summary": "A frequency table records how many times each event appears.",
    "mode": "function",
    "starter": "def event_counts(events):\n    # Count how many times each label occurs.\n    pass\n",
    "cases": [
      {
        "call": "event_counts(['run', 'jump', 'run'])",
        "expected": "{'run': 2, 'jump': 1}"
      },
      {
        "call": "event_counts([])",
        "expected": "{}"
      },
      {
        "call": "event_counts(['a', 'a', 'a'])",
        "expected": "{'a': 3}"
      },
      {
        "call": "event_counts(['x', 'y'])",
        "expected": "{'x': 1, 'y': 1}"
      }
    ],
    "points": 10,
    "hints": [
      "Create an empty dictionary for the counts.",
      "Loop over each event label.",
      "Assign `counts[event] = counts.get(event, 0) + 1`."
    ],
    "markdown": "09-dictionaries-and-data/lessons/02-count-with-dictionaries.md",
    "functionName": "event_counts",
    "language": "python",
    "markdownSource": "# Dictionaries & Data — Lesson 2: Count repeated events\n\n**New skill:** Frequency tables and dictionary updates  \n**Previously learned:** Units 01–08\n\n## Why this matters\n\nA classroom app could tally survey choices or event types without a fixed list of categories.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nevents = ['run', 'jump', 'run']\ncounts = {}\nfor event in events:\n    counts[event] = counts.get(event, 0) + 1\nprint(counts)\n```\n\n## Step 2 — Trace the code\n\n1. Start with an empty dictionary.\n2. For each event, get the current count (default 0).\n3. Add one and save the updated count under that event key.\n\n## Step 3 — Check your understanding\n\nTrace the counts after each item in `['A','B','A']`.\n\n## Step 4 — Watch for this mistake\n\nOverwriting every count with 1 loses the previous total. Increment the existing count.\n\n## Practice: Count repeated events\n\nComplete `event_counts(events)` to return a dictionary mapping each event string to how many times it occurred.\n\n**Function contract:** `event_counts(events)`  \n**Starter file:** [`main.py`](../../practice/02-count-with-dictionaries/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nCreate an empty dictionary for the counts.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nLoop over each event label.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nAssign `counts[event] = counts.get(event, 0) + 1`.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "09-dictionaries-and-data/03-records-and-fields",
    "unit": 9,
    "unitName": "Dictionaries & Data",
    "lesson": 3,
    "slug": "03-records-and-fields",
    "title": "Read a collection of records",
    "concept": "Lists of dictionaries, fields and comparison",
    "summary": "A list of dictionaries can represent several records with the same field names.",
    "mode": "function",
    "starter": "def best_student(records):\n    # Compare record scores, keeping the first in a tie.\n    pass\n",
    "cases": [
      {
        "call": "best_student([{'name': 'Kai', 'score': 11}, {'name': 'Lee', 'score': 15}])",
        "expected": "'Lee'"
      },
      {
        "call": "best_student([{'name': 'A', 'score': 5}, {'name': 'B', 'score': 5}])",
        "expected": "'A'"
      },
      {
        "call": "best_student([{'name': 'Solo', 'score': -2}])",
        "expected": "'Solo'"
      },
      {
        "call": "best_student([{'name': 'A', 'score': -5}, {'name': 'B', 'score': -1}])",
        "expected": "'B'"
      }
    ],
    "points": 10,
    "hints": [
      "Start with the first record as your best.",
      "Compare the `score` fields, not the names.",
      "Use `>` rather than `>=` to preserve the first name in a tie."
    ],
    "markdown": "09-dictionaries-and-data/lessons/03-records-and-fields.md",
    "functionName": "best_student",
    "language": "python",
    "markdownSource": "# Dictionaries & Data — Lesson 3: Read a collection of records\n\n**New skill:** Lists of dictionaries, fields and comparison  \n**Previously learned:** Units 01–08\n\n## Why this matters\n\nThis pattern appears in scoreboards, check-in logs, and reports built from data.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nrecords = [{'name': 'Kai', 'score': 11}, {'name': 'Lee', 'score': 15}]\nbest = records[0]\nfor record in records:\n    if record['score'] > best['score']:\n        best = record\nprint(best['name'])\n```\n\n## Step 2 — Trace the code\n\n1. Read each record as a dictionary with `name` and `score` keys.\n2. Begin with the first record as the current best.\n3. Visit each record and replace the best only for a strictly higher score.\n\n## Step 3 — Check your understanding\n\nWhich name wins if two records share the highest score and we compare using `>`?\n\n## Step 4 — Watch for this mistake\n\nStarting the best score at 0 fails when every score is negative. Start from the first record.\n\n## Practice: Read a collection of records\n\nComplete `best_student(records)` to return the name belonging to the highest score. In a tie, choose the first student. The input is nonempty.\n\n**Function contract:** `best_student(records)`  \n**Starter file:** [`main.py`](../../practice/03-records-and-fields/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nStart with the first record as your best.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nCompare the `score` fields, not the names.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nUse `>` rather than `>=` to preserve the first name in a tie.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "09-dictionaries-and-data/04-inventory-calculator",
    "unit": 9,
    "unitName": "Dictionaries & Data",
    "lesson": 4,
    "slug": "04-inventory-calculator",
    "title": "Calculate an inventory order",
    "concept": "Dictionary items, nested lookup, accumulators",
    "summary": "A short program can combine quantities and prices from separate dictionaries to calculate a total.",
    "mode": "function",
    "starter": "def order_total(quantities, prices):\n    # Multiply each quantity by its price and total the order.\n    pass\n",
    "cases": [
      {
        "call": "order_total({'pen': 3, 'notebook': 2}, {'pen': 2, 'notebook': 5})",
        "expected": "16"
      },
      {
        "call": "order_total({'pen': 2, 'unknown': 4}, {'pen': 3})",
        "expected": "6"
      },
      {
        "call": "order_total({}, {'x': 10})",
        "expected": "0"
      },
      {
        "call": "order_total({'badge': 5}, {'badge': 0})",
        "expected": "0"
      }
    ],
    "points": 15,
    "hints": [
      "Start a numeric total at zero.",
      "Loop over `quantities.items()`.",
      "Multiply each count by `prices.get(item, 0)` before adding it."
    ],
    "markdown": "09-dictionaries-and-data/lessons/04-inventory-calculator.md",
    "functionName": "order_total",
    "language": "python",
    "markdownSource": "# Dictionaries & Data — Lesson 4: Calculate an inventory order\n\n**New skill:** Dictionary items, nested lookup, accumulators  \n**Previously learned:** Units 01–08\n\n## Why this matters\n\nInventory and checkout tools combine multiple data sources while handling missing information carefully.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nquantities = {'pen': 3, 'notebook': 2}\nprices = {'pen': 2, 'notebook': 5}\ntotal = 0\nfor item, count in quantities.items():\n    total += count * prices.get(item, 0)\nprint(total)\n```\n\n## Step 2 — Trace the code\n\n1. Read `.items()` as pairs of an item name and its quantity.\n2. Find the price for each name with a default of zero.\n3. Multiply quantity by price and add the subtotal to a running total.\n\n## Step 3 — Check your understanding\n\nWhat is the total for two pens at 3 each and one binder at 7?\n\n## Step 4 — Watch for this mistake\n\nDo not add quantities directly to prices. Multiply each item's quantity by its price.\n\n## Practice: Calculate an inventory order\n\nComplete `order_total(quantities, prices)` to return the total price. Missing prices count as zero.\n\n**Function contract:** `order_total(quantities, prices)`  \n**Starter file:** [`main.py`](../../practice/04-inventory-calculator/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nStart a numeric total at zero.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nLoop over `quantities.items()`.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nMultiply each count by `prices.get(item, 0)` before adding it.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  }
];
