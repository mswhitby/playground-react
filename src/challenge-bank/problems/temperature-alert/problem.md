# Temperature Alert

Choose a status label based on a temperature reading.

## Problem

Given an integer temperature in degrees Fahrenheit, return `"Freeze"` when the value is **32 or below**, `"Heat"` when it is **90 or above**, and `"Normal"` otherwise. Treat boundary values as inclusive.

## Input and output

Implement the supplied function and **return** a value. Do not print the answer unless your language runner explicitly requests it.

## Examples

**Example 1**

```json
{
  "arguments": [
    32
  ],
  "expected": "Freeze"
}
```

**Example 2**

```json
{
  "arguments": [
    90
  ],
  "expected": "Heat"
}
```

**Example 3**

```json
{
  "arguments": [
    72
  ],
  "expected": "Normal"
}
```

**Example 4**

```json
{
  "arguments": [
    -5
  ],
  "expected": "Freeze"
}
```

## Constraints

- -100 ≤ degrees ≤ 150

## Skills

conditionals, comparisons, functions.

## How to approach it

Identify the inputs and expected return value, trace the provided examples, then write and test your own implementation.
