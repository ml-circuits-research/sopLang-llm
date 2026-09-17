# Explanation 27.10 — Sorting categories by value

## Explanation

1. The categories are compared only through their values, so the ranking is a descending sort of the printed pairs.
2. Sorting A=3, B=9, C=5, D=7 from greatest to least gives B, D, C, A.

Reference solution as printed in the source (chapter 27, 4 steps):

1. 9 is greatest and belongs to B.
2. Next is 7 at D.
3. Then 5 at C.
4. 3 at A is smallest.

## Result

**Answer.** B, D, C, A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
