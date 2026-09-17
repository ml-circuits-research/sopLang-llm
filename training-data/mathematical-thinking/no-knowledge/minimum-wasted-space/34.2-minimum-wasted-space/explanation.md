# Explanation 34.2 — Minimum wasted space

## Explanation

1. Unused space is what the chosen boxes can hold minus the 10 objects.
2. Option A uses 2 boxes of 6, leaving 2; option B uses 3 boxes of 4, leaving 2.
3. Comparing the leftovers shows the options are equal, so neither wastes less than the other.

Reference solution as printed in the source (chapter 34, 4 steps):

1. A provides 12 places for 10 objects → 2 unused.
2. B also provides 12 places → 2 unused.
3. The number of boxes differs, but total capacity is the same.
4. By the criterion “unused space,” the options are equal.

## Result

**Answer.** Equal: 2 unused places.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
