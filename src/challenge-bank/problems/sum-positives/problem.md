# Sum Positive Values

Add only the positive values in a data set.

## Problem

Given an array of integers, add only values strictly **greater than zero**. Ignore zeros and negative values. Return `0` if no positive values are present.

## Input and output

Implement the supplied function and **return** a value. Do not print the answer unless your language runner explicitly requests it.

## Examples

**Example 1**

```json
{
  "arguments": [
    [
      -3,
      6,
      0,
      2,
      -1
    ]
  ],
  "expected": 8
}
```

**Example 2**

```json
{
  "arguments": [
    [
      -5,
      0,
      -1
    ]
  ],
  "expected": 0
}
```

**Example 3**

```json
{
  "arguments": [
    []
  ],
  "expected": 0
}
```

## Constraints

- 0 ≤ number count ≤ 200
- -1000 ≤ each value ≤ 1000

## Skills

arrays, loops, accumulators.

## How to approach it

Identify the inputs and expected return value, trace the provided examples, then write and test your own implementation.
