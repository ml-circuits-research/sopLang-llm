# Explanation 28.23 — Choosing two objects of different colors

## Explanation

1. A mixed pair takes one red ball and one blue ball, so the colors fix the roles.
2. There are 3 red choices and, independently, 2 blue choices.
3. 3 × 2 = 6 pairs of different colors.

Reference solution as printed in the source (chapter 28, 4 steps):

1. First choose one of the 3 red balls.
2. For each red ball there are 2 possible blue balls.
3. The pairs are distinct because the balls are individually identified.
4. 3×2=6.

## Result

**Answer.** 6 pairs.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
