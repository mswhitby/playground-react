# Longest Winning Streak

Find the longest consecutive run of winning results.

## Problem

Given an array of booleans (`true` means a win and `false` means a loss), return the length of the longest consecutive run of `true` values. The streak resets after each loss. Return `0` if there are no wins.

## Input and output

Implement the supplied function and **return** a value. Do not print the answer unless your language runner explicitly requests it.

## Examples

**Example 1**

```json
{
  "arguments": [
    [
      true,
      true,
      false,
      true,
      true,
      true
    ]
  ],
  "expected": 3
}
```

**Example 2**

```json
{
  "arguments": [
    [
      false,
      false
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

**Example 4**

```json
{
  "arguments": [
    [
      true,
      true
    ]
  ],
  "expected": 2
}
```

## Constraints

- 0 ≤ match count ≤ 500

## Skills

arrays, loops, state.

## How to approach it

Identify the inputs and expected return value, trace the provided examples, then write and test your own implementation.
