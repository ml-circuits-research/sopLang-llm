# Explanation 29.3 — “Exclusive or” means exactly one

## Explanation

1. Exclusive or is true only when exactly one of red and round holds, so having both is not enough and having neither is too little.
2. Counting the satisfied properties of each piece and keeping the count equal to one removes the pieces that satisfy two properties or none.
3. Only A and B remain, which is why the piece with both properties is excluded.

Reference solution as printed in the source (chapter 29, 4 steps):

1. A has only red → accepted.
2. B has only round → accepted.
3. C has both → does not satisfy “exactly one”.
4. D has neither → does not satisfy it.

## Result

**Answer.** A and B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
