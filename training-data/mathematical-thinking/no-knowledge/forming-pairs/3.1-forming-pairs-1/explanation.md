# Explanation 3.1 — Forming Pairs 1

## Explanation

1. A complete group needs exactly 2 objects, so the number of complete groups is how many times 2 fits inside 10.
2. Repeatedly taking 2 at a time from 10 gives 5 complete groups and leaves 0 unused.
3. Checking the division: 5 × 2 + 0 = 10, and the remainder is smaller than the group size.

Reference solution as printed in the source (chapter 3, 3 steps):

1. Group them: each pair uses 2 gloves.
2. 10 can be written as 2+2+... five times.
3. Therefore 5 pairs are formed and nothing remains.

## Result

**Answer.** 5 pairs, remainder 0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
