# Explanation 223 — Fair allocation by the rule: proportional to need

## Explanation

1. The need-proportional principle uses the stated weights 3:3:5.
2. Those weights total 11, so each district takes the fraction weight ÷ 11 of the fund of 35 units.
3. Applying the fractions in printed order gives A=9.55, B=9.55, C=15.91.

Reference solution as printed in the source (family N20, 3 steps):

1. Total need weight=11.
2. Multiply the fund by each need fraction.
3. Allocation result: A=9.55, B=9.55, C=15.91.

## Result

**Answer.** A=9.55, B=9.55, C=15.91.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
