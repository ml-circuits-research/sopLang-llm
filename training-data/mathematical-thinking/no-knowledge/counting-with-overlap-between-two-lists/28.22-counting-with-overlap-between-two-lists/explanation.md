# Explanation 28.22 — Counting with overlap between two lists

## Explanation

1. Adding the two lists counts the 2 children on both lists twice.
2. Subtracting the overlap once counts every child exactly once.
3. 5 + 4 − 2 = 7 different children.

Reference solution as printed in the source (chapter 28, 4 steps):

1. Adding 5+4 counts the common children twice.
2. There are 2 such children.
3. Subtract one extra count for each: 9−2=7.
4. The result counts each child exactly once.

## Result

**Answer.** 7 children.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
