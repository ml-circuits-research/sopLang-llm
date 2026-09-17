# Explanation 9.24 — Combinations by Listing 4

## Explanation

1. A menu is exactly one sandwich paired with exactly one juice, so the list of menus is built pair by pair.
2. Each of the 3 sandwiches can be combined with any of the 4 juices, giving 4 menus per sandwich.
3. Adding 4 once for each sandwich gives 3×4 = 12 different menus.

Reference solution as printed in the source (chapter 9, 3 steps):

1. For the first sandwich there are 4 juice choices.
2. The same is true for each of the 3 sandwiches.
3. In total, we have 3 groups of 4: 3×4=12.

## Result

**Answer.** 12

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
