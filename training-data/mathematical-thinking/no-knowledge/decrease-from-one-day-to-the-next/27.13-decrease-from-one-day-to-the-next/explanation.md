# Explanation 27.13 — Decrease from one day to the next

## Explanation

1. The size of a decrease is measured from the earlier value to the later one: 10 minus 6.
2. The result 4 is how many units disappeared, which is how the decrease is reported.

Reference solution as printed in the source (chapter 27, 4 steps):

1. Start from the earlier value 10.
2. The new value is 6.
3. 10−6=4 units have disappeared.
4. We say “it decreased by 4”.

## Result

**Answer.** By 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
