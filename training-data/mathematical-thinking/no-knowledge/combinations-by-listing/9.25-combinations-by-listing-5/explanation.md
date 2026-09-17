# Explanation 9.25 — Combinations by Listing 5

## Explanation

1. A menu is exactly one sandwich paired with exactly one juice, so the list of menus is built pair by pair.
2. Each of the 4 sandwiches can be combined with any of the 3 juices, giving 3 menus per sandwich.
3. Adding 3 once for each sandwich gives 4×3 = 12 different menus.

Reference solution as printed in the source (chapter 9, 3 steps):

1. For the first sandwich there are 3 juice choices.
2. The same is true for each of the 4 sandwiches.
3. In total, we have 4 groups of 3: 4×3=12.

## Result

**Answer.** 12

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
