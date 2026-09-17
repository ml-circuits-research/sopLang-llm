# Explanation 32.7 — Alternative route after a failure

## Explanation

1. Deleting the broken link leaves the other links in place, so any route that avoids it may still survive.
2. Searching the remaining network shows that A still reaches C along A-D-C.

Reference solution as printed in the source (chapter 32, 4 steps):

1. The path A-B-C is interrupted.
2. But A is linked to D.
3. D is linked to C.
4. The sequence A-D-C provides an alternative route.

## Result

**Answer.** Yes, A-D-C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
