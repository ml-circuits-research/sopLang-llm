# Explanation 237 — Sampling and opinion: case 2

## Explanation

1. The stated design is: A school wants opinions on lunch. It randomly selects 10 students from each grade.
2. That selection mechanism does not obviously favour people connected to the answer, so no bias is established by the stated design.
3. The verdict and its direction follow from comparing the selection mechanism with the target population, not from the number of answers collected.

Reference solution as printed in the source (family N23, 4 steps):

1. Identify the target population.
2. Compare the selection method with that target.
3. Random selection within every grade gives broad grade coverage; no obvious topic-specific selection is stated.
4. Therefore the method is not obviously biased for the stated target, within the limits given.

## Result

**Answer.** Not obviously biased under the stated design. Random selection within every grade gives broad grade coverage; no obvious topic-specific selection is stated.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
