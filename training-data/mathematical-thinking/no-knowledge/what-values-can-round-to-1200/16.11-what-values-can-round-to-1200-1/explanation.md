# Explanation 16.11 — What Values Can Round to 1200? 1

## Explanation

1. The statement defines the whole interval that rounds to the target hundred: an integer qualifies when it is at least the lower bound and at most the upper bound.
2. The interval before What Values Can Round to 1200? runs from 1150 to 1249, and the candidate is 1160.
3. Testing both comparisons together shows the candidate lies inside that interval, so it rounds to the target.

Reference solution as printed in the source (chapter 16, 4 steps):

1. The allowed interval is [1150,1249].
2. The number 1160 is ≥1150.
3. The number 1160 is ≤1249.
4. Therefore it satisfies both conditions and rounds to 1200.

## Result

**Answer.** Yes, 1160 rounds to 1200.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
