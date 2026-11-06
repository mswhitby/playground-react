// Console messages for the simulated editor buttons. Nothing is executed, graded or submitted.
export function runMockAction(action, code, task) {
  switch (action) {
    case "Reset":
      return "Editor reset to sample starter code.";
    case "Submit":
      return "Local preview only: no assignment was submitted and no grade or points were awarded.";
    case "Run":
      return (
        "Run preview: code is not executed here.\n\nYour draft contains " +
        code.split("\n").length +
        " lines."
      );
    default:
      return (
        "Sample check: " +
        (code.trim().length > task.starter.trim().length
          ? "You added content. This is not an automated correctness check."
          : "Starter code is unchanged. This is only a UI preview.")
      );
  }
}
