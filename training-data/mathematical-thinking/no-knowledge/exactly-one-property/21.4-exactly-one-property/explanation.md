# Explanation 21.4 — Exactly One Property

## Explanation

1. "Exactly one" splits into two disjoint groups: circle without square and square without circle.
2. Subtracting the 2 shared labels gives 2 circle-only and 4 square-only labels.
3. Their sum is 6 labels.

Reference solution as printed in the source (chapter 21, 4 steps):

1. Of the 4 with a circle, 2 also have a square, so 4-2=2 have only a circle.
2. Of the 6 with a square, 2 also have a circle, so 6-2=4 have only a square.
3. The two groups do not overlap, so add them: 2+4=6.
4. The 2 with both properties do not belong to “exactly one.”

## Result

**Answer.** 6 labels.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
