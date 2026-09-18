# Explanation 102 — Quorum and majority in a 18-member committee

## Explanation

1. The quorum threshold is the stated share of all members rounded up: ceil(0.6 x 18) = 11.
2. The committee has 17 members present, so quorum is met; the 1 abstention count for presence but not as no votes.
3. The vote comparison is yes against no only: 9 against 7, so the strict majority is satisfied.
4. A motion passes only when both tests hold, so the motion passes.

Reference solution as printed in the source (family C3, 4 steps):

1. Quorum threshold=ceil(0.60×18)=11.
2. Present=17, so quorum is met.
3. Yes=9, no=7; yes>no is True.
4. Combine the two tests.

## Result

**Answer.** Quorum is met; the motion passes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
