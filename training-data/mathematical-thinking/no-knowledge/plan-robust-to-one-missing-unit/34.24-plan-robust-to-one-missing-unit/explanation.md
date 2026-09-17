# Explanation 34.24 — Plan robust to one missing unit

## Explanation

1. The plan must still work with one vehicle missing, so the usable capacity is (3 − 1) × 5 = 10.
2. The demand is 10 people, and 10 is at least that.
3. So the capacity is sufficient even in the degraded case, and the answer is yes.

Reference solution as printed in the source (chapter 34, 4 steps):

1. In the failure scenario, two vehicles remain.
2. Their total capacity is 10.
3. The requirement is 10.
4. The plan still works exactly at the limit.

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
