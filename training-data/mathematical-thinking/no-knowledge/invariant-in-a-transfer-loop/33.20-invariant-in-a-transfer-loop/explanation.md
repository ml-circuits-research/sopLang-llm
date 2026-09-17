# Explanation 33.20 — Invariant in a transfer loop

## Explanation

1. An invariant is a quantity that every step of the loop leaves unchanged, so it is checked across one operation.
2. The operation changes A by -1 and B by 1, so the two changes cancel in the total.
3. Adding both coordinates gives (A-1)+(B+1)=A+B, so the sum A+B is the quantity that stays fixed.

Reference solution as printed in the source (chapter 33, 4 steps):

1. A decreases by 1.
2. B increases by 1.
3. The changes cancel in the sum.
4. A+B remains constant after every operation.

## Result

**Answer.** The sum A+B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
