# Explanation 918 — Regeneration and harvest: case 3

## Explanation

1. The annual net change is regeneration minus harvest, 16 − 18 = -2 units per year.
2. Over 3 years the stock therefore changes by 3 × -2 = -6 units, so the final stock is 140 + -6 = 134 units.
3. Comparing the final stock with the starting stock of 140 units shows the stock declines, which makes the harvest not sustainable under the stated definition.

Reference solution as printed in the source (family N9, 4 steps):

1. Annual net change=16−18=-2.
2. Three-year change=-6.
3. Final stock=140+(-6)=134.
4. Compare final stock with starting stock.

## Result

**Answer.** 134 units; not sustainable under the stated definition.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
