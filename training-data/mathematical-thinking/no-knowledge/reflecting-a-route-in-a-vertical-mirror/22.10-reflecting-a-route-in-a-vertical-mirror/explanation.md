# Explanation 22.10 — Reflecting a route in a vertical mirror

## Explanation

1. A vertical mirror reverses left and right, so every east move becomes a west move and every west move becomes an east move.
2. North and south are unaffected, so only the east-west letters of the route change.
3. Applying the swap to each leg gives W,N,W,S.

Reference solution as printed in the source (chapter 22, 4 steps):

1. The first E becomes W.
2. N remains N.
3. The second E also becomes W.
4. S remains S.

## Result

**Answer.** W,N,W,S.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
