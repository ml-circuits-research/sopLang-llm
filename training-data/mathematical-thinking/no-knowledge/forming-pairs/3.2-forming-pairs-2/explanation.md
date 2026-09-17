# Explanation 3.2 — Forming Pairs 2

## Explanation

1. A complete group needs exactly 2 objects, so the number of complete groups is how many times 2 fits inside 12.
2. Repeatedly taking 2 at a time from 12 gives 6 complete groups and leaves 0 unused.
3. Checking the division: 6 × 2 + 0 = 12, and the remainder is smaller than the group size.

Reference solution as printed in the source (chapter 3, 3 steps):

1. Group them: each pair uses 2 gloves.
2. 12 can be written as 2+2+... six times.
3. Therefore 6 pairs are formed and nothing remains.

## Result

**Answer.** 6 pairs, remainder 0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
