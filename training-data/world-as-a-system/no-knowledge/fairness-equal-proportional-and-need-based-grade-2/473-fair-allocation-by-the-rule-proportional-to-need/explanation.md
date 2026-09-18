# Explanation 473 — Fair allocation by the rule: proportional to need

## Explanation

1. The need-proportional principle uses the stated weights 3:4:5.
2. Those weights total 12, so each district takes the fraction weight ÷ 12 of the fund of 40 units.
3. Applying the fractions in printed order gives A=10.00, B=13.33, C=16.67.

Reference solution as printed in the source (family N20, 3 steps):

1. Total need weight=12.
2. Multiply the fund by each need fraction.
3. Allocation result: A=10.00, B=13.33, C=16.67.

## Result

**Answer.** A=10.00, B=13.33, C=16.67.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
