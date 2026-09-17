# Explanation 39.19 — Proof by intuitive monotonicity

## Explanation

1. On the number line, adding the same distance to both sides slides both points the same amount to the right.
2. A translation preserves the gap and the left-to-right order, so the inequality keeps its direction.

Reference solution as printed in the source (chapter 39, 4 steps):

1. b is to the right of a.
2. Move both points 3 units to the right.
3. The distance between them does not change.
4. The point obtained from b remains to the right of the point obtained from a.

## Result

**Answer.** a+3<b+3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
