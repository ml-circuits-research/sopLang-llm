# Explanation 34.22 — Choose by total cost, not unit price

## Explanation

1. Only whole packages can be bought and the total must be exactly 6 notebooks, so each package type needs a whole number of packages.
2. Package A reaches 6 with 2 packages for 18 lei, and package B needs 3 packages for 21 lei.
3. Comparing the totals rather than the unit prices shows packages A is cheaper.

Reference solution as printed in the source (chapter 34, 4 steps):

1. With A, 2 packages are needed: 6 notebooks, 18 lei.
2. With B, 3 are needed: 6 notebooks, 21 lei.
3. Both give exactly the required quantity.
4. 18<21.

## Result

**Answer.** Packages A, 18 lei.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
