# Explanation 240 — Sampling and opinion: case 5

## Explanation

1. The stated design is: An online poll is open to anyone who chooses to click it.
2. That selection mechanism favours people who are connected to the answer, so the sample is likely biased away from the whole population.
3. The verdict and its direction follow from comparing the selection mechanism with the target population, not from the number of answers collected.

Reference solution as printed in the source (family N23, 4 steps):

1. Identify the target population.
2. Compare the selection method with that target.
3. People who choose to click may differ systematically from those who ignore the poll.
4. Therefore the method is likely biased.

## Result

**Answer.** Likely biased. People who choose to click may differ systematically from those who ignore the poll.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
