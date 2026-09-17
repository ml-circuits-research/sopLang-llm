# Explanation 26.14 — A deadline two working days later

## Explanation

1. Working days are the block from Monday to Friday in the weekday order given by the fact table.
2. Because Friday is explicitly not counted as the first day, the count starts at zero and advances one weekday at a time, admitting only days inside the block.
3. Two admitted steps after Friday land on Tuesday, which is the deadline.

Reference solution as printed in the source (chapter 26, 4 steps):

1. Saturday is not a working day.
2. Sunday is not a working day.
3. Monday is the first working day after Friday.
4. Tuesday is the second.

## Result

**Answer.** Tuesday.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
