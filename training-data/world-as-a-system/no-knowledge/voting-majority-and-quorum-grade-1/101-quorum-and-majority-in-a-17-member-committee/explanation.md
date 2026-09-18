# Explanation 101 — Quorum and majority in a 17-member committee

## Explanation

1. The quorum threshold is the stated share of all members rounded up: ceil(0.6 x 17) = 11.
2. The committee has 17 members present, so quorum is met; the 1 abstention count for presence but not as no votes.
3. The vote comparison is yes against no only: 8 against 8, so the strict majority is not satisfied.
4. A motion passes only when both tests hold, so the motion does not pass.

Reference solution as printed in the source (family C3, 4 steps):

1. Quorum threshold=ceil(0.60×17)=11.
2. Present=17, so quorum is met.
3. Yes=8, no=8; yes>no is False.
4. Combine the two tests.

## Result

**Answer.** Quorum is met; the motion does not pass.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
