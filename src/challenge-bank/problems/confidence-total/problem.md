# Confidence Pool Total

Compute the points earned from predictions.

## Problem

Given two arrays of equal length, `correct` (booleans) and `weights` (positive integers), return the sum of the weights at positions where `correct[i]` is `true`. The arrays are aligned by index. Return `0` for empty arrays. This is a generic weighted-prediction scoring task, not a betting exercise.

## Input and output

Implement the supplied function and **return** a value. Do not print the answer unless your language runner explicitly requests it.

## Examples

**Example 1**

```json
{
  "arguments": [
    [
      true,
      false,
      true
    ],
    [
      20,
      18,
      15
    ]
  ],
  "expected": 35
}
```

**Example 2**

```json
{
  "arguments": [
    [
      false,
      false
    ],
    [
      5,
      8
    ]
  ],
  "expected": 0
}
```

**Example 3**

```json
{
  "arguments": [
    [],
    []
  ],
  "expected": 0
}
```

## Constraints

- 0 ≤ array length ≤ 200
- 1 ≤ each weight ≤ 100

## Skills

arrays, loops, parallel-arrays.

## How to approach it

Identify the inputs and expected return value, trace the provided examples, then write and test your own implementation.
