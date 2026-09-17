# Explanation 25.14 — How many distinct corners does a strip of two squares have?

## Explanation

1. Joining the two squares along a complete side removes the shared side from the boundary.
2. What remains is a 1×2 rectangle, whose boundary is a single closed outline.
3. That outline has four distinct corners, where the sides change direction.

Reference solution as printed in the source (chapter 25, 4 steps):

1. After joining, the shared side is interior.
2. The outer boundary becomes one longer rectangle.
3. A rectangle has four changes of direction at its corners.
4. Points on the shared side are not corners of the outer boundary.

## Result

**Answer.** 4 corners.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
