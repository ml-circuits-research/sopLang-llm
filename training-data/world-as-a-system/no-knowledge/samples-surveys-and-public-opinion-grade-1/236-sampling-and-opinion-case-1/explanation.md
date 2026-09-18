# Explanation 236 — Sampling and opinion: case 1

## Explanation

1. The stated design is: A town wants to estimate how many residents use buses. It surveys only people waiting at the bus station.
2. That selection mechanism favours people who are connected to the answer, so the sample is likely biased away from the whole population.
3. The verdict and its direction follow from comparing the selection mechanism with the target population, not from the number of answers collected.

Reference solution as printed in the source (family N23, 4 steps):

1. Identify the target population.
2. Compare the selection method with that target.
3. People already at the bus station are more likely than average to use buses.
4. Therefore the method is likely biased.

## Result

**Answer.** Likely biased. People already at the bus station are more likely than average to use buses.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
