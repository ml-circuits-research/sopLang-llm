# Explanation 27.25 — Changing a total after correcting one datum

## Explanation

1. Only one term changes, so the total moves by the same amount as that term: 9 minus 7 is 2.
2. Adding that correction to the calculated total 16 gives 18, without adding the other terms again.

Reference solution as printed in the source (chapter 27, 4 steps):

1. The correct value is 2 greater than the old value.
2. The other values do not change.
3. The total increases by the same difference, 2.
4. 16+2=18.

## Result

**Answer.** 18.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
