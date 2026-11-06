// Public Computer Science I Unit 1 content copied from published classroom site.
export default [
  {
    "id": "01-how-programs-work/01-first-message",
    "unit": 1,
    "unitName": "How Programs Work",
    "lesson": 1,
    "slug": "01-first-message",
    "title": "Instructions and output",
    "concept": "Output and strings",
    "summary": "Tell a computer what to display using a simple Python instruction.",
    "mode": "script",
    "starter": "# Use print() to display the exact welcome message.\n# Your program should display one line.\n",
    "cases": [
      {
        "expected": "Welcome to Computer Science I"
      }
    ],
    "points": 5,
    "hints": [
      "Which Python function displays a message?",
      "Place the exact words in matching quotation marks.",
      "Check spacing and capitalization. The checker looks at the output, not at your preferred wording."
    ],
    "markdown": "01-how-programs-work/01-instructions-and-output.md",
    "existingPassKey": "cs1:unit01:pass:01-first-message",
    "existingDraftKey": "cs1:unit01:draft:01-first-message",
    "language": "python",
    "markdownSource": "# Lesson 01 — Instructions and Output\n\n## What is a program?\n\nA **program** is a set of instructions a computer follows. A **programming language** gives us a precise way to write those instructions. Python is one such language.\n\nA computer does not infer your intentions. It follows the instructions you actually write. Even a small spelling or punctuation mistake can change what happens.\n\n## Your first Python instruction\n\n```python\nprint(\"Hello, Python!\")\n```\n\n**Output**\n\n```text\nHello, Python!\n```\n\n`print()` displays information. The parentheses hold the value to display, and the quotation marks tell Python that the contents are text (a **string**). The quotation marks are not printed.\n\nTry changing the text and running again:\n\n```python\nprint(\"I can make a computer display my message.\")\n```\n\nYou can use either single quotes or double quotes around a string as long as the opening and closing quote match.\n\n```python\nprint('Welcome')\nprint(\"Welcome\")\n```\n\n## Vocabulary\n\n- **Python interpreter:** software that executes Python instructions.\n- **Source code:** the instructions written by a programmer.\n- **String:** a piece of text surrounded by matching quotation marks.\n- **Output:** information a program displays or produces.\n- **Syntax:** rules for writing valid instructions.\n\n## Practice: First Message\n\nWrite a program that displays exactly:\n\n```text\nWelcome to Computer Science I\n```\n\nUse `print()`. Matching capitalization and spacing matter. Open [the starter file](practice/01-first-message/main.py) or choose **First Message** in the browser app.\n\n## Stop and think\n\n1. Why is `print(Hello)` different from `print(\"Hello\")`?\n2. What happens if you forget a closing parenthesis?\n3. How could you verify that your program did what you intended?\n"
  },
  {
    "id": "01-how-programs-work/02-startup-sequence",
    "unit": 1,
    "unitName": "How Programs Work",
    "lesson": 2,
    "slug": "02-startup-sequence",
    "title": "Sequence and tracing",
    "concept": "Program sequence",
    "summary": "Learn how the order of instructions changes the result.",
    "mode": "script",
    "starter": "# These lines are correct, but they are in the wrong order.\n# Rearrange them so the robot reports its startup steps correctly.\nprint(\"Checking sensors...\")\nprint(\"Ready.\")\nprint(\"Booting...\")\n",
    "cases": [
      {
        "expected": "Booting...\nChecking sensors...\nReady."
      }
    ],
    "points": 5,
    "hints": [
      "Look at the first line of the expected output.",
      "Move existing statements; do not rewrite their messages.",
      "Check the result line by line, including punctuation."
    ],
    "markdown": "01-how-programs-work/02-sequence-and-tracing.md",
    "existingPassKey": "cs1:unit01:pass:02-startup-sequence",
    "existingDraftKey": "cs1:unit01:draft:02-startup-sequence",
    "language": "python",
    "markdownSource": "# Lesson 02 — Sequence and Tracing\n\n## Computers follow an order\n\nPython usually executes instructions **top to bottom**, one line at a time.\n\n```python\nprint(\"First\")\nprint(\"Second\")\nprint(\"Third\")\n```\n\n**Output**\n\n```text\nFirst\nSecond\nThird\n```\n\nReversing two lines changes the result.\n\nA **trace** is a record of what a program does, step by step. Before running a program, try predicting its output.\n\n| Line executed | Output added |\n|---|---|\n| `print(\"Checking battery\")` | `Checking battery` |\n| `print(\"Starting motor\")` | `Starting motor` |\n\n`print()` normally ends with a new line, so each call displays its message on a separate line.\n\n## Practice: Startup Sequence\n\nA robot should display these three messages in the following order:\n\n```text\nBooting...\nChecking sensors...\nReady.\n```\n\nThe starter code contains the right messages but in the wrong order. Move the instructions into the correct sequence. [View starter](practice/02-startup-sequence/main.py).\n\n## Stop and think\n\n- Can all three messages be correct while the overall output is wrong?\n- Why should a programmer test the **order** of output as well as the words themselves?\n"
  },
  {
    "id": "01-how-programs-work/03-fix-the-messages",
    "unit": 1,
    "unitName": "How Programs Work",
    "lesson": 3,
    "slug": "03-fix-the-messages",
    "title": "Comments and debugging",
    "concept": "Comments and debugging",
    "summary": "Read an error message, repair the instructions, and try again.",
    "mode": "script",
    "starter": "# This program has syntax errors. Find and repair them.\nprint(\"Debugging in progress\"\nprint('Problem solved\")\n",
    "cases": [
      {
        "expected": "Debugging in progress\nProblem solved"
      }
    ],
    "points": 5,
    "hints": [
      "Run the starter first. What type of error appears?",
      "Match every opening parenthesis with a closing one.",
      "Match each opening quotation mark with the same kind of closing quote, then try again."
    ],
    "markdown": "01-how-programs-work/03-comments-and-debugging.md",
    "existingPassKey": "cs1:unit01:pass:03-fix-the-messages",
    "existingDraftKey": "cs1:unit01:draft:03-fix-the-messages",
    "language": "python",
    "markdownSource": "# Lesson 03 — Comments and Debugging\n\n## Comments explain code\n\nA comment starts with `#`. Python ignores the comment when running the program.\n\n```python\n# Explain what this program is doing.\nprint(\"Systems ready\")\n```\n\n**Output**\n\n```text\nSystems ready\n```\n\nComments can make code more understandable, but they do not fix incorrect instructions.\n\n## Not all bugs are the same\n\nA **syntax error** means Python cannot understand the code's structure. For example:\n\n```python\nprint(\"Starting...\"\n```\n\nPython reports an error because the parentheses are unbalanced.\n\nA **logic error** means the program runs but produces the wrong behavior:\n\n```python\nprint(\"Task finished\")\nprint(\"Task started\")\n```\n\nBoth instructions are valid. Their order might be incorrect for the intended task.\n\n## A debugging habit\n\n1. Read the expected behavior.\n2. Run the program and look closely at the error or output.\n3. Change one thing you believe is wrong.\n4. Run again and compare.\n\n## Practice: Fix the Messages\n\nThe starter has punctuation mistakes that prevent the program from running. Correct them so the program displays exactly:\n\n```text\nDebugging in progress\nProblem solved\n```\n\n[View starter](practice/03-fix-the-messages/main.py).\n\n## Stop and think\n\n- Does a program that runs without errors always produce the correct output?\n- How can an error message help narrow down where a mistake happened?\n"
  },
  {
    "id": "01-how-programs-work/04-robotics-status",
    "unit": 1,
    "unitName": "How Programs Work",
    "lesson": 4,
    "slug": "04-robotics-status",
    "title": "Cumulative mini-project",
    "concept": "Cumulative project",
    "summary": "Combine printing, sequence, and comments in a program you write yourself.",
    "mode": "script",
    "starter": "# Write a three-line robotics status display.\n# Include a comment explaining the purpose of your program.\n",
    "cases": [
      {
        "expected": "Wagner Robotics\nSystem online\nReady to launch"
      }
    ],
    "points": 5,
    "hints": [
      "Remember how Python moves from one line to the next.",
      "The earlier lessons showed how to display text on separate lines.",
      "Include one comment explaining the purpose of your script."
    ],
    "markdown": "01-how-programs-work/04-mini-project.md",
    "existingPassKey": "cs1:unit01:pass:04-robotics-status",
    "existingDraftKey": "cs1:unit01:draft:04-robotics-status",
    "language": "python",
    "markdownSource": "# Lesson 04 — Cumulative Mini-Project: Robotics Status\n\nYou've practiced producing output, arranging instructions, and debugging syntax. Now combine these skills without a step-by-step code template.\n\n## Scenario\n\nA student robotics team is preparing a display for a demonstration. When the status program starts, it should display exactly these three lines, in order:\n\n```text\nWagner Robotics\nSystem online\nReady to launch\n```\n\n## Your task\n\nIn [`practice/04-robotics-status/main.py`](practice/04-robotics-status/main.py), write your own Python instructions.\n\nRequirements:\n\n- Use the Python skills from this unit.\n- Include a short comment stating the purpose of the program.\n- Display the messages in the required order.\n- Match capitalization, spelling, punctuation, and spaces.\n- No keyboard input, variables, loops, or custom functions are required.\n\n## Before checking\n\nRead your script from the top down and **predict** its output. Then run it and compare what appears.\n\nIf your code produces an error, use the debugging routine from Lesson 03.\n\n## Reflection\n\nIn one or two sentences, explain why precise instructions matter when writing a program for a real robot, mobile app, or website.\n"
  }
];
