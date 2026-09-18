# Explanation 670 — Regeneration and harvest: case 5

## Explanation

1. The annual net change is regeneration minus harvest, 20 − 23 = -3 units per year.
2. Over 3 years the stock therefore changes by 3 × -3 = -9 units, so the final stock is 130 + -9 = 121 units.
3. Comparing the final stock with the starting stock of 130 units shows the stock declines, which makes the harvest not sustainable under the stated definition.

Reference solution as printed in the source (family N9, 4 steps):

1. Annual net change=20−23=-3.
2. Three-year change=-9.
3. Final stock=130+(-9)=121.
4. Compare final stock with starting stock.

## Result

**Answer.** 121 units; not sustainable under the stated definition.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
