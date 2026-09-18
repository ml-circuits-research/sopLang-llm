# Explanation 739 — Sampling and opinion: case 4

## Explanation

1. The stated design is: A library surveys every 20th visitor entering over a full week.
2. That selection mechanism does not obviously favour people connected to the answer, so no bias is established by the stated design.
3. The verdict and its direction follow from comparing the selection mechanism with the target population, not from the number of answers collected.
4. The appended cross-domain check is evaluated from its own stated quantities and printed as the labelled suffix.

Reference solution as printed in the source (family N23, 4 steps):

1. Identify the target population.
2. Compare the selection method with that target.
3. Sampling every 20th visitor across a full week is systematic within the visitor population; it may represent visitors reasonably, though not non-visitors.
4. Therefore the method is not obviously biased for the stated target, within the limits given. Cross-domain check: 15−4=11 independent reports remain.

## Result

**Answer.** Not obviously biased under the stated design. Sampling every 20th visitor across a full week is systematic within the visitor population; it may represent visitors reasonably, though not non-visitors. Cross-domain answer: 11 independent reports.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
