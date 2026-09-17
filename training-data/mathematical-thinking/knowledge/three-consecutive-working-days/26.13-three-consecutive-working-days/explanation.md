# Explanation 26.13 — Three consecutive working days

## Explanation

1. The working week is the block from Monday to Friday, read on the weekday order supplied by the fact table; Saturday and Sunday are outside it.
2. The start day counts as the first working day, so the 3 required days are counted by walking forward one weekday at a time and skipping any day outside the block.
3. The walk from Thursday crosses the weekend and stops on Monday.

Reference solution as printed in the source (chapter 26, 4 steps):

1. Thursday is the first working day used.
2. Friday is the second.
3. Saturday and Sunday are skipped.
4. Monday is the third working day, so the task finishes then.

## Result

**Answer.** Monday.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
