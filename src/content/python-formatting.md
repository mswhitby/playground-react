# Format a Summary

## Learn

Formatting transforms raw data into something a reader can understand. Python's **f-strings** make that easier.

```python
player = "Avery"
points = 18
summary = f"{player} scored {points} points"
print(summary)
```

You can also control the number of decimals displayed:

```python
average = 17.625
print(f"Average: {average:.1f}")
```

## Practice

Given the player's name and points, print one polished summary line.

**Success criteria:** The summary contains the player's name, a numerical point value, and a clear description of what the number represents.
