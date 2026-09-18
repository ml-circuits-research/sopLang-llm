# Explanation 168 — Regeneration and harvest: case 3

## Explanation

1. The annual net change is regeneration minus harvest, 16 − 15 = 1 units per year.
2. Over 3 years the stock therefore changes by 3 × 1 = 3 units, so the final stock is 110 + 3 = 113 units.
3. Comparing the final stock with the starting stock of 110 units shows the stock does not decline, which makes the harvest sustainable under the stated definition.

Reference solution as printed in the source (family N9, 4 steps):

1. Annual net change=16−15=1.
2. Three-year change=3.
3. Final stock=110+(3)=113.
4. Compare final stock with starting stock.

## Result

**Answer.** 113 units; sustainable under the stated definition.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
