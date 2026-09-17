# Explanation 33.4 — Why sorting helps binary search

## Explanation

1. Halving works because the middle element splits the list into a smaller part and a larger part, and the comparison tells us which part to keep.
2. That guarantee is produced by the sort: in a sorted list every item left of the middle is smaller and every item right of it is larger.
3. Without that order an element larger than the middle can sit anywhere, so discarding a whole side could throw away the target.

Reference solution as printed in the source (chapter 33, 4 steps):

1. The elimination rule relies on all elements to the left being ≤ the middle element.
2. An unsorted list does not have this property.
3. A larger target could still be on the left.
4. We could accidentally discard the position containing the target.

## Result

**Answer.** Because without sorting, position gives no reliable information about size.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
