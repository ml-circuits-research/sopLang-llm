# Explanation 417 — Regeneration and harvest: case 2

## Explanation

1. The annual net change is regeneration minus harvest, 14 − 13 = 1 units per year.
2. Over 3 years the stock therefore changes by 3 × 1 = 3 units, so the final stock is 120 + 3 = 123 units.
3. Comparing the final stock with the starting stock of 120 units shows the stock does not decline, which makes the harvest sustainable under the stated definition.

Reference solution as printed in the source (family N9, 4 steps):

1. Annual net change=14−13=1.
2. Three-year change=3.
3. Final stock=120+(3)=123.
4. Compare final stock with starting stock.

## Result

**Answer.** 123 units; sustainable under the stated definition.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
