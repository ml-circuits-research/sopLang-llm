# Explanation 238 — Sampling and opinion: case 3

## Explanation

1. The stated design is: A village asks only members of the sports club whether to build a sports field.
2. That selection mechanism favours people who are connected to the answer, so the sample is likely biased away from the whole population.
3. The verdict and its direction follow from comparing the selection mechanism with the target population, not from the number of answers collected.

Reference solution as printed in the source (family N23, 4 steps):

1. Identify the target population.
2. Compare the selection method with that target.
3. Sports-club members are likely to be more favorable to a sports field than the whole village.
4. Therefore the method is likely biased.

## Result

**Answer.** Likely biased. Sports-club members are likely to be more favorable to a sports field than the whole village.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
