# Explanation 16.14 — What Values Can Round to 4800? 4

## Explanation

1. The statement defines the whole interval that rounds to the target hundred: an integer qualifies when it is at least the lower bound and at most the upper bound.
2. The interval before What Values Can Round to 4800? runs from 4750 to 4849, and the candidate is 4775.
3. Testing both comparisons together shows the candidate lies inside that interval, so it rounds to the target.

Reference solution as printed in the source (chapter 16, 4 steps):

1. The allowed interval is [4750,4849].
2. The number 4775 is ≥4750.
3. The number 4775 is ≤4849.
4. Therefore it satisfies both conditions and rounds to 4800.

## Result

**Answer.** Yes, 4775 rounds to 4800.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
