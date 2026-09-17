# Explanation 33.1 — Linear search in a list

## Explanation

1. The algorithm walks the list from the left and stops at the first match, so each visited element costs exactly one comparison.
2. The elements 4, 7, 2 are compared one by one, and the last of them is 2.
3. That is 3 comparisons; the elements after the match are never touched.

Reference solution as printed in the source (chapter 33, 4 steps):

1. Comparison 1: 4≠2.
2. Comparison 2: 7≠2.
3. Comparison 3: 2=2, so it stops.
4. It does not check 9.

## Result

**Answer.** 3 comparisons.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
