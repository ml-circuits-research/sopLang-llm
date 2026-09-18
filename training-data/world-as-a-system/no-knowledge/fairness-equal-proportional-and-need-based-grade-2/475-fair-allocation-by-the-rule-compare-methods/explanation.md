# Explanation 475 — Fair allocation by the rule: compare methods

## Explanation

1. The highest-need district is C, whose need score 7 is the largest.
2. Equal allocation gives it 13.33, while need-proportional allocation gives it 17.50.
3. The need-proportional principle gives that district more, so the printed allocation is A=12.50, B=10.00, C=17.50.

Reference solution as printed in the source (family N20, 4 steps):

1. Equal allocation gives C 13.33.
2. Need-proportional allocation gives C 17.50.
3. Compare those amounts.
4. Allocation result: A=12.50, B=10.00, C=17.50.

## Result

**Answer.** A=12.50, B=10.00, C=17.50.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
