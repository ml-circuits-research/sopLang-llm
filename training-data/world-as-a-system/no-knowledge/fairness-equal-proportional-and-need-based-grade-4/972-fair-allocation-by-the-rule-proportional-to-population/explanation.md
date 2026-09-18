# Explanation 972 — Fair allocation by the rule: proportional to population

## Explanation

1. The population-proportional principle uses the stated weights 10:20:30.
2. Those weights total 60, so each district takes the fraction weight ÷ 60 of the fund of 50 units.
3. Applying the fractions in printed order gives A=8.33, B=16.67, C=25.00.

Reference solution as printed in the source (family N20, 3 steps):

1. Total population weight=60.
2. Multiply the fund by each population fraction.
3. Allocation result: A=8.33, B=16.67, C=25.00.

## Result

**Answer.** A=8.33, B=16.67, C=25.00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
