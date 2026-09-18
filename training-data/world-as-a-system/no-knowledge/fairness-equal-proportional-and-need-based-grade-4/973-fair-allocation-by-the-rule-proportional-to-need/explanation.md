# Explanation 973 — Fair allocation by the rule: proportional to need

## Explanation

1. The need-proportional principle uses the stated weights 3:6:5.
2. Those weights total 14, so each district takes the fraction weight ÷ 14 of the fund of 50 units.
3. Applying the fractions in printed order gives A=10.71, B=21.43, C=17.86.

Reference solution as printed in the source (family N20, 3 steps):

1. Total need weight=14.
2. Multiply the fund by each need fraction.
3. Allocation result: A=10.71, B=21.43, C=17.86.

## Result

**Answer.** A=10.71, B=21.43, C=17.86.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
