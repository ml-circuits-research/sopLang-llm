# Explanation 462 — Funding a shared public project: case 2

## Explanation

1. The provision rule makes the project depend on one aggregate: the voluntary contributions summed against the stated threshold of 12 tokens.
2. Adding the 6 listed contributions gives 15, which is at least the threshold, so the project is built.
3. The shortfall is the threshold minus the total when that difference is positive and zero otherwise, here 0 additional tokens.
4. The threshold answers only whether the project is produced; it says nothing by itself about whether the contribution pattern is fair.

Reference solution as printed in the source (family N18, 3 steps):

1. Total contribution=2+3+4+1+2+3=15.
2. Compare 15 with threshold 12.
3. Additional amount needed=max(0,12−15)=0.

## Result

**Answer.** The project is built. Additional tokens needed: 0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
