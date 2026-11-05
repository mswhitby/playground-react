# Second Largest Distinct Value

Return the second-highest unique integer in a collection.

## Problem

Given an array of integers, return the **second-largest distinct value**, not the value at the second index after sorting with duplicates. If fewer than two different values exist, return `null` (`None` in Python). Negative numbers are valid.

## Input and output

Implement the supplied function and **return** a value. Do not print the answer unless your language runner explicitly requests it.

## Examples

**Example 1**

```json
{
  "arguments": [
    [
      3,
      1,
      3,
      2
    ]
  ],
  "expected": 2
}
```

**Example 2**

```json
{
  "arguments": [
    [
      5,
      5
    ]
  ],
  "expected": null
}
```

**Example 3**

```json
{
  "arguments": [
    [
      -10,
      -7,
      -7,
      -2
    ]
  ],
  "expected": -7
}
```

**Example 4**

```json
{
  "arguments": [
    [
      1
    ]
  ],
  "expected": null
}
```

## Constraints

- 0 ≤ array length ≤ 500
- -100000 ≤ each value ≤ 100000

## Skills

arrays, comparisons, distinct-values.

## How to approach it

Identify the inputs and expected return value, trace the provided examples, then write and test your own implementation.
