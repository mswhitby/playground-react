# Format a Score Line

Format a player score as a clear single line of text.

## Problem

Given a player name and an integer points value, return a string using this **exact** format: `Name: N points`. Preserve the original spelling and spacing of the name. Use one space after the colon and before `points`.

## Input and output

Implement the supplied function and **return** a value. Do not print the answer unless your language runner explicitly requests it.

## Examples

**Example 1**

```json
{
  "arguments": [
    "Avery",
    18
  ],
  "expected": "Avery: 18 points"
}
```

**Example 2**

```json
{
  "arguments": [
    "Jordan Lee",
    0
  ],
  "expected": "Jordan Lee: 0 points"
}
```

**Example 3**

```json
{
  "arguments": [
    "Mia",
    -2
  ],
  "expected": "Mia: -2 points"
}
```

## Constraints

- 1 ≤ name length ≤ 50
- -1000 ≤ points ≤ 1000

## Skills

strings, formatting, functions.

## How to approach it

Identify the inputs and expected return value, trace the provided examples, then write and test your own implementation.
