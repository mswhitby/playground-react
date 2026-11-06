// Public Computer Science I Unit 7 content copied from published classroom site.
export default [
  {
    "id": "07-strings-and-text/01-index-and-length",
    "unit": 7,
    "unitName": "Strings & Text Processing",
    "lesson": 1,
    "slug": "01-index-and-length",
    "title": "Read characters by position",
    "concept": "String indexing and length",
    "summary": "A string is an ordered sequence of characters. Positions start at zero, and negative indexes count from the end.",
    "mode": "function",
    "starter": "def edge_letters(text):\n    # Return the first and last characters, in that order.\n    pass\n",
    "cases": [
      {
        "call": "edge_letters('robot')",
        "expected": "'rt'"
      },
      {
        "call": "edge_letters('AA')",
        "expected": "'AA'"
      },
      {
        "call": "edge_letters('Python')",
        "expected": "'Pn'"
      },
      {
        "call": "edge_letters('Z9')",
        "expected": "'Z9'"
      }
    ],
    "points": 5,
    "hints": [
      "Access the first character with index 0.",
      "A negative index can select the final character.",
      "Join the two selected characters with `+`."
    ],
    "markdown": "07-strings-and-text/lessons/01-index-and-length.md",
    "functionName": "edge_letters",
    "language": "python",
    "markdownSource": "# Strings & Text Processing — Lesson 1: Read characters by position\n\n**New skill:** String indexing and length  \n**Previously learned:** Units 01–06\n\n## Why this matters\n\nPlayer names, QR labels, and message codes are strings. Programs often need to inspect just a few characters.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nlabel = 'T-BIRD'\nprint(len(label))\nprint(label[0])\nprint(label[-1])\n```\n\n## Step 2 — Trace the code\n\n1. Run the example and note that the string has six characters.\n2. Trace index 0 to the first character, then trace index -1 to the final character.\n3. Notice that indexing reads a character but does not change the original string.\n\n## Step 3 — Check your understanding\n\nFor the text `ROBOT`, predict `text[1]` and `len(text)` before running.\n\n## Step 4 — Watch for this mistake\n\n`text[len(text)]` goes one position beyond the last valid index. Use `len(text) - 1` or `-1`.\n\n## Practice: Read characters by position\n\nComplete `edge_letters(text)` to return the first and last characters joined into a two-character string. The input contains at least two characters.\n\n**Function contract:** `edge_letters(text)`  \n**Starter file:** [`main.py`](../../practice/01-index-and-length/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nAccess the first character with index 0.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nA negative index can select the final character.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nJoin the two selected characters with `+`.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "07-strings-and-text/02-slices-and-substrings",
    "unit": 7,
    "unitName": "Strings & Text Processing",
    "lesson": 2,
    "slug": "02-slices-and-substrings",
    "title": "Take a slice of a string",
    "concept": "Slicing, bounds and uppercasing",
    "summary": "A slice extracts part of a string without modifying it; the ending position is excluded.",
    "mode": "function",
    "starter": "def short_code(text):\n    # Take three characters and return their uppercase version.\n    pass\n",
    "cases": [
      {
        "call": "short_code('computer')",
        "expected": "'COM'"
      },
      {
        "call": "short_code('app')",
        "expected": "'APP'"
      },
      {
        "call": "short_code('robotics')",
        "expected": "'ROB'"
      },
      {
        "call": "short_code('XyZ987')",
        "expected": "'XYZ'"
      }
    ],
    "points": 5,
    "hints": [
      "Use a slice that starts at the beginning.",
      "Remember that the stop index is excluded.",
      "Call the string method `.upper()` on the slice."
    ],
    "markdown": "07-strings-and-text/lessons/02-slices-and-substrings.md",
    "functionName": "short_code",
    "language": "python",
    "markdownSource": "# Strings & Text Processing — Lesson 2: Take a slice of a string\n\n**New skill:** Slicing, bounds and uppercasing  \n**Previously learned:** Units 01–06\n\n## Why this matters\n\nApps create short category tags, previews, and IDs from longer names.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nword = 'playground'\nprint(word[:4])\nprint(word[4:])\nprint(word[:4].upper())\n```\n\n## Step 2 — Trace the code\n\n1. Read `word[:4]` as characters from the beginning up to, but not including, index 4.\n2. Change the ending index and compare the outputs.\n3. Apply `.upper()` to a slice to create an uppercase code.\n\n## Step 3 — Check your understanding\n\nPredict `'coding'[1:4]`. Which letters does Python include?\n\n## Step 4 — Watch for this mistake\n\nA slice uses an exclusive end position. `[:3]` takes three characters, not four.\n\n## Practice: Take a slice of a string\n\nComplete `short_code(text)` to return the first three characters of `text` in uppercase. Inputs contain at least three characters.\n\n**Function contract:** `short_code(text)`  \n**Starter file:** [`main.py`](../../practice/02-slices-and-substrings/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nUse a slice that starts at the beginning.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nRemember that the stop index is excluded.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nCall the string method `.upper()` on the slice.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "07-strings-and-text/03-clean-up-input",
    "unit": 7,
    "unitName": "Strings & Text Processing",
    "lesson": 3,
    "slug": "03-clean-up-input",
    "title": "Clean messy text",
    "concept": "strip, lower, replace",
    "summary": "String methods can normalize inconsistent user input without requiring the user to type perfectly.",
    "mode": "function",
    "starter": "def normalize_tag(tag):\n    # Normalize the input into a lowercase hyphenated tag.\n    pass\n",
    "cases": [
      {
        "call": "normalize_tag('  Coding Club  ')",
        "expected": "'coding-club'"
      },
      {
        "call": "normalize_tag('Python')",
        "expected": "'python'"
      },
      {
        "call": "normalize_tag('  A B C ')",
        "expected": "'a-b-c'"
      },
      {
        "call": "normalize_tag('Game Design')",
        "expected": "'game-design'"
      }
    ],
    "points": 10,
    "hints": [
      "Begin with `.strip()`.",
      "Chain `.lower()` after removing outside spaces.",
      "Use `.replace(' ', '-')` for internal spaces."
    ],
    "markdown": "07-strings-and-text/lessons/03-clean-up-input.md",
    "functionName": "normalize_tag",
    "language": "python",
    "markdownSource": "# Strings & Text Processing — Lesson 3: Clean messy text\n\n**New skill:** strip, lower, replace  \n**Previously learned:** Units 01–06\n\n## Why this matters\n\nSearching and tagging work better when extra spaces and inconsistent capitalization are removed.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\ntag = '  Coding Club  '\nprint(tag.strip())\nprint(tag.strip().lower())\nprint(tag.strip().lower().replace(' ', '-'))\n```\n\n## Step 2 — Trace the code\n\n1. `.strip()` removes leading and trailing spaces.\n2. `.lower()` makes letter case consistent.\n3. `.replace(' ', '-')` changes internal spaces into hyphens. Apply the operations in order.\n\n## Step 3 — Check your understanding\n\nWhat does `'  Game Design  '.strip().lower()` produce? What remains between the words?\n\n## Step 4 — Watch for this mistake\n\n`.strip()` does not remove spaces between words, and string methods return new strings.\n\n## Practice: Clean messy text\n\nComplete `normalize_tag(tag)` to remove surrounding whitespace, lowercase letters, and replace every internal space with a hyphen.\n\n**Function contract:** `normalize_tag(tag)`  \n**Starter file:** [`main.py`](../../practice/03-clean-up-input/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nBegin with `.strip()`.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nChain `.lower()` after removing outside spaces.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nUse `.replace(' ', '-')` for internal spaces.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  },
  {
    "id": "07-strings-and-text/04-build-a-badge",
    "unit": 7,
    "unitName": "Strings & Text Processing",
    "lesson": 4,
    "slug": "04-build-a-badge",
    "title": "Build a digital name badge",
    "concept": "Formatting and multiple parameters",
    "summary": "A function can combine several cleaned input strings into a single, precisely formatted message.",
    "mode": "function",
    "starter": "def format_badge(name, role):\n    # Format two pieces of text as one badge label.\n    pass\n",
    "cases": [
      {
        "call": "format_badge('  nova  ', ' student ')",
        "expected": "'Nova | STUDENT'"
      },
      {
        "call": "format_badge('lee', 'helper')",
        "expected": "'Lee | HELPER'"
      },
      {
        "call": "format_badge('  alex kim ', 'team lead ')",
        "expected": "'Alex Kim | TEAM LEAD'"
      },
      {
        "call": "format_badge('JORDAN', ' staff')",
        "expected": "'Jordan | STAFF'"
      }
    ],
    "points": 15,
    "hints": [
      "Use `.strip().title()` for the name.",
      "Use `.strip().upper()` for the role.",
      "Return the formatted string instead of printing it."
    ],
    "markdown": "07-strings-and-text/lessons/04-build-a-badge.md",
    "functionName": "format_badge",
    "language": "python",
    "markdownSource": "# Strings & Text Processing — Lesson 4: Build a digital name badge\n\n**New skill:** Formatting and multiple parameters  \n**Previously learned:** Units 01–06\n\n## Why this matters\n\nThe same formatting rules can serve an event sign-in screen, classroom app, or simple roster.\n\n## Step 1 — Explore working Python\n\nRead the program below. Before running it, write down the result you expect.\n\n```python\nname = '  nOVA  '\nrole = ' student '\nclean_name = name.strip().title()\nclean_role = role.strip().upper()\nprint(clean_name + ' | ' + clean_role)\n```\n\n## Step 2 — Trace the code\n\n1. Normalize each input separately, so each rule is easy to test.\n2. Use `.title()` for the display name and `.upper()` for the role.\n3. Combine the results with the exact separator `' | '`.\n\n## Step 3 — Check your understanding\n\nPredict the output when the name is `'  aLEX KIM '` and the role is `'helper'`.\n\n## Step 4 — Watch for this mistake\n\nOutput punctuation and spaces are part of the function contract. Do not add extra quotation marks around the result.\n\n## Practice: Build a digital name badge\n\nComplete `format_badge(name, role)` to return the trimmed name in title case, then ` | `, then the trimmed role in uppercase.\n\n**Function contract:** `format_badge(name, role)`  \n**Starter file:** [`main.py`](../../practice/04-build-a-badge/main.py)\n\nWork in the editor, using **Run** to explore and **Check** to compare against the published examples. Your submitted code, not the public check, determines the recorded score.\n\n<details>\n<summary>Hint 1 — Start</summary>\n\nUse `.strip().title()` for the name.\n\n</details>\n\n<details>\n<summary>Hint 2 — Build</summary>\n\nUse `.strip().upper()` for the role.\n\n</details>\n\n<details>\n<summary>Hint 3 — Test</summary>\n\nReturn the formatted string instead of printing it.\n\n</details>\n\n## Reflect\n\nIn 3–5 sentences, explain the algorithm you chose, one test case you predicted, and how you would detect an incorrect answer.\n\n## Optional reading\n\nFor another perspective on this skill, see *How to Think Like a Computer Scientist* ([interactive textbook](https://runestone.academy/ns/books/published/thinkcspy/index.html/)). This Playground lesson, worked example, and exercise are original; no textbook passages were reproduced.\n"
  }
];
