# Explanation 29.10 — “At most one” as a limit

## Explanation

1. A valid code may have at most 1 lamp on, which is an upper bound rather than an exact value.
2. Counting the lamps described as on gives 2.
3. That count exceeds the limit, so the state is invalid and the answer is no.

Reference solution as printed in the source (chapter 29, 4 steps):

1. The first lamp is on.
2. The second is off.
3. The third is on; total on=2.
4. 2 exceeds the limit 1.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
