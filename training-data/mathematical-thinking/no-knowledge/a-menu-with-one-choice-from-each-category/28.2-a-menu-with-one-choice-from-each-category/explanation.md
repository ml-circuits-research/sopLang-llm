# Explanation 28.2 — A menu with one choice from each category

## Explanation

1. A complete menu picks one item from each of 2 soups, 2 main courses, and 2 desserts.
2. The three picks are made independently, so the counts multiply.
3. 2 × 2 × 2 = 8 complete menus.

Reference solution as printed in the source (chapter 28, 4 steps):

1. For each soup there are 2 choices of main course.
2. For each such choice there are 2 desserts.
3. One soup therefore gives 4 menus.
4. Two soups give 2×4=8.

## Result

**Answer.** 8 menus.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
