# Explanation 715 — Funding a shared public project: case 5

## Explanation

1. The provision rule makes the project depend on one aggregate: the voluntary contributions summed against the stated threshold of 14 tokens.
2. Adding the 7 listed contributions gives 16, which is at least the threshold, so the project is built.
3. The shortfall is the threshold minus the total when that difference is positive and zero otherwise, here 0 additional tokens.
4. The threshold answers only whether the project is produced; it says nothing by itself about whether the contribution pattern is fair.

Reference solution as printed in the source (family N18, 3 steps):

1. Total contribution=1+2+3+4+1+2+3=16.
2. Compare 16 with threshold 14.
3. Additional amount needed=max(0,14−16)=0. Cross-domain check: 11−4=7 independent reports remain.

## Result

**Answer.** The project is built. Additional tokens needed: 0. Cross-domain answer: 7 independent reports.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
