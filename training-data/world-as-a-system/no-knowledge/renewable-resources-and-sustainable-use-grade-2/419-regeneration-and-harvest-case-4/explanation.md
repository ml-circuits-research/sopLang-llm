# Explanation 419 — Regeneration and harvest: case 4

## Explanation

1. The annual net change is regeneration minus harvest, 18 − 19 = -1 units per year.
2. Over 3 years the stock therefore changes by 3 × -1 = -3 units, so the final stock is 120 + -3 = 117 units.
3. Comparing the final stock with the starting stock of 120 units shows the stock declines, which makes the harvest not sustainable under the stated definition.

Reference solution as printed in the source (family N9, 4 steps):

1. Annual net change=18−19=-1.
2. Three-year change=-3.
3. Final stock=120+(-3)=117.
4. Compare final stock with starting stock.

## Result

**Answer.** 117 units; not sustainable under the stated definition.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
