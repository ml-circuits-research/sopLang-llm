# Explanation 33.2 — Unsuccessful search

## Explanation

1. An unsuccessful search has no match that can end it early, so every element must be examined.
2. Testing all 4 elements and finding none equal to 5 is what licenses saying that the value is absent.
3. The answer is therefore 4 comparisons, one per element.

Reference solution as printed in the source (chapter 33, 4 steps):

1. 3 is not 5.
2. 6 is not 5.
3. 8 is not 5.
4. 1 is not 5; only after the last test can we conclude that 5 is absent.

## Result

**Answer.** 4 comparisons.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
