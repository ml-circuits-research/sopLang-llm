# Explanation 34.23 — Choice with two objectives and priority

## Explanation

1. The duration rule is a hard constraint: a plan whose duration exceeds 10 minutes is not considered at all.
2. That removes the plan taking 12 minutes, leaving P1 as the only allowed plan.
3. Among the allowed plans P1 has the lowest cost, so it is chosen.

Reference solution as printed in the source (chapter 34, 4 steps):

1. Test the time constraint first.
2. P1 has 8≤10, so it is allowed.
3. P2 has 12>10, so it is eliminated even though it is cheaper.
4. P1 remains.

## Result

**Answer.** P1.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
