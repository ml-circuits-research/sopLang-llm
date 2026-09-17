# Explanation 26.6 — The last day of a given month

## Explanation

1. The month starts on Friday with the label day 1, so day 28 is 27 day steps later.
2. Removing whole weeks from 27 steps leaves the displacement modulo seven that the weekday cycle senses.
3. Continuing that displacement from Friday along the order given by the fact table lands on Thursday, the last day of the 28-day month.

Reference solution as printed in the source (chapter 26, 4 steps):

1. After 21 days, day 22 is Friday again.
2. From 22 to 28 there are 6 steps.
3. Saturday 23, Sunday 24, Monday 25, Tuesday 26, Wednesday 27, Thursday 28.
4. Therefore the last day is Thursday.

## Result

**Answer.** Thursday.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
