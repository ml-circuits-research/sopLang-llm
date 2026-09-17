# Explanation 23.4 — A clue whose usefulness depends on another clue

## Explanation

1. The first clue is applied before the second one, so the second clue only removes candidates that survived the first.
2. Counting those removed candidates gives the answer without ever changing the order of the clues.

Reference solution as printed in the source (chapter 23, 4 steps):

1. A eliminates 1 and 2, leaving 3,4,5,6.
2. Among these, the even numbers are 4 and 6.
3. B eliminates 3 and 5.
4. Therefore B eliminates two candidates after A has been applied.

## Result

**Answer.** 2 candidates.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
