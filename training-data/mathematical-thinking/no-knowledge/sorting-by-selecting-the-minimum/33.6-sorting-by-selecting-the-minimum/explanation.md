# Explanation 33.6 — Sorting by selecting the minimum

## Explanation

1. The algorithm scans the list once to locate the smallest element, which is 2 here.
2. It then exchanges that element with the element currently in the first position, so exactly one swap puts the minimum at the front.
3. The remaining elements keep their relative order, and the list becomes 2, 3, 5, 7.

Reference solution as printed in the source (chapter 33, 4 steps):

1. Compare the values and find the minimum, 2.
2. The minimum must be placed in the first position.
3. Swap 2 with the current first element, 7.
4. The list becomes [2,3,5,7].

## Result

**Answer.** [2,3,5,7].

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
