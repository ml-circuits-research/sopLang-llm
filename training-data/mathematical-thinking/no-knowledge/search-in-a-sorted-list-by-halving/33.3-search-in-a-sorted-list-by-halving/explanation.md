# Explanation 33.3 — Search in a sorted list by halving

## Explanation

1. The first probe is the middle of the whole list; because the target is larger, the half to its left is discarded and only the larger items remain.
2. The next probe is the middle of that remaining part, which is 12.
3. Each step halves the candidates, so a sorted list needs far fewer checks than a linear scan.

Reference solution as printed in the source (chapter 33, 4 steps):

1. The first comparison with 8 shows that the target must be to the right.
2. The sorted sublist [10,12,14] remains.
3. Its middle element is 12.
4. The algorithm checks it and finds the target.

## Result

**Answer.** 12.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
