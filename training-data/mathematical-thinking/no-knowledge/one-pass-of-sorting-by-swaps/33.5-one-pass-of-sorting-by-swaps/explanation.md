# Explanation 33.5 — One pass of sorting by swaps

## Explanation

1. One pass visits the neighboring pairs (5,2), (2,4) from left to right and swaps a pair only when it descends.
2. A larger element therefore travels one position to the right per pass, while a smaller element can move left across several pairs at once.
3. After the full pass the list reads 2, 4, 5.

Reference solution as printed in the source (chapter 33, 4 steps):

1. Compare 5 and 2; 5>2, so swap: [2,5,4].
2. Then compare 5 and 4; swap: [2,4,5].
3. The pass ends.
4. The largest element has moved to the right.

## Result

**Answer.** [2,4,5].

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
