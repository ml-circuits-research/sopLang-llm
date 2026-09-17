# Explanation 16.15 — What Values Can Round to 6300? 5

## Explanation

1. The statement defines the whole interval that rounds to the target hundred: an integer qualifies when it is at least the lower bound and at most the upper bound.
2. The interval before What Values Can Round to 6300? runs from 6250 to 6349, and the candidate is 6280.
3. Testing both comparisons together shows the candidate lies inside that interval, so it rounds to the target.

Reference solution as printed in the source (chapter 16, 4 steps):

1. The allowed interval is [6250,6349].
2. The number 6280 is ≥6250.
3. The number 6280 is ≤6349.
4. Therefore it satisfies both conditions and rounds to 6300.

## Result

**Answer.** Yes, 6280 rounds to 6300.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
