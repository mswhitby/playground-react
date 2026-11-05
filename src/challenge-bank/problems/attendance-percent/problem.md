# Attendance Percentage

Convert an attendance fraction into a whole-number percentage.

## Problem

Given the number of students present and the total number enrolled, return the whole-number attendance percentage, **rounding down**. Calculate `floor(100 × present / total)`. The total will always be greater than zero.

## Input and output

Implement the supplied function and **return** a value. Do not print the answer unless your language runner explicitly requests it.

## Examples

**Example 1**

```json
{
  "arguments": [
    18,
    20
  ],
  "expected": 90
}
```

**Example 2**

```json
{
  "arguments": [
    2,
    3
  ],
  "expected": 66
}
```

**Example 3**

```json
{
  "arguments": [
    0,
    30
  ],
  "expected": 0
}
```

**Example 4**

```json
{
  "arguments": [
    7,
    7
  ],
  "expected": 100
}
```

## Constraints

- 1 ≤ total ≤ 10000
- 0 ≤ present ≤ total

## Skills

arithmetic, integer-division, functions.

## How to approach it

Identify the inputs and expected return value, trace the provided examples, then write and test your own implementation.
