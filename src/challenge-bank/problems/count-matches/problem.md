# Count Matching Events

Count how often a particular event code appears.

## Problem

Given an array of integer event codes and a target integer, return the number of positions whose value matches the target. Every occurrence counts, including duplicates. Return `0` for an empty array.

## Input and output

Implement the supplied function and **return** a value. Do not print the answer unless your language runner explicitly requests it.

## Examples

**Example 1**

```json
{
  "arguments": [
    [
      2,
      1,
      2,
      3,
      2
    ],
    2
  ],
  "expected": 3
}
```

**Example 2**

```json
{
  "arguments": [
    [],
    7
  ],
  "expected": 0
}
```

**Example 3**

```json
{
  "arguments": [
    [
      3,
      4
    ],
    5
  ],
  "expected": 0
}
```

## Constraints

- 0 ≤ event count ≤ 200
- -1000 ≤ codes and target ≤ 1000

## Skills

arrays, loops, comparisons.

## How to approach it

Identify the inputs and expected return value, trace the provided examples, then write and test your own implementation.
