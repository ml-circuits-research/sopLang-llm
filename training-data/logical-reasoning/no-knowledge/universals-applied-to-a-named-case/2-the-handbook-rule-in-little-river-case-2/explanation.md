# Explanation 2 — The handbook rule in Little River — case 2

## Explanation

1. The handbook lists the sparrow as a bird and the oak as a tree, and the universal covers every listed bird.
2. Ben points at the listed sparrow, so the property is forced for it.
3. Cara points at the listed oak, which the same universal does not touch; a class that is not on the page is not a premise.

Reference solution as printed in the source (section 1, 5 steps):

1. Copy the universal: every handbook-bird lays eggs.
2. The sparrow is classified as a handbook-bird.
3. The oak is classified as a tree, so the universal does not apply.
4. Deduction uses the closed list, not a private zoo.
5. If it is not on the page, it is not a premise.

## Result

**Answer.** Only Ben’s. The sparrow is a listed bird, so the universal covers it. The oak is listed as a tree, so the same universal does not touch it.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
