# Count Pairs With Target Sum

Count every pair of positions that reaches a target sum.

## Problem

Given an integer array and a target integer, count pairs of **different indices** `(i, j)` where `i < j` and `numbers[i] + numbers[j] == target`. Duplicate values at different positions create distinct pairs. Return `0` if no pairs exist.

## Input and output

Implement the supplied function and **return** a value. Do not print the answer unless your language runner explicitly requests it.

## Examples

**Example 1**

```json
{
  "arguments": [
    [
      1,
      3,
      2,
      2,
      4
    ],
    4
  ],
  "expected": 2
}
```

**Example 2**

```json
{
  "arguments": [
    [
      2,
      2,
      2
    ],
    4
  ],
  "expected": 3
}
```

**Example 3**

```json
{
  "arguments": [
    [
      1,
      2,
      3
    ],
    9
  ],
  "expected": 0
}
```

**Example 4**

```json
{
  "arguments": [
    [],
    1
  ],
  "expected": 0
}
```

## Constraints

- 0 ≤ array length ≤ 300
- -1000 ≤ numbers and target ≤ 1000

## Skills

arrays, nested-loops, counting.

## How to approach it

Identify the inputs and expected return value, trace the provided examples, then write and test your own implementation.
