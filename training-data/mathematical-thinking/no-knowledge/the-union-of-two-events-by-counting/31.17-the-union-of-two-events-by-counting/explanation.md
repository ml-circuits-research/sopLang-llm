# Explanation 31.17 — The union of two events by counting

## Explanation

1. "A or B" is satisfied by every outcome in either event, so its size is the union of the two outcome sets rather than the sum of their sizes.
2. Event A contributes 2, 4, 6 and event B adds 5, while the shared outcomes are counted once.
3. The union has 4 outcomes out of 6 equally likely ones, so the probability is 2/3.

Reference solution as printed in the source (chapter 31, 4 steps):

1. List A: 2,4,6.
2. List B: 5,6.
3. In the union, 6 is counted only once.
4. There are 4 favorable outcomes out of6: 4/6=2/3.

## Result

**Answer.** 2/3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
