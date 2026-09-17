# Explanation 23.23 — A property that is possible but not certain

## Explanation

1. The candidates are 4 and 5, and the property "even" is tested on each of them.
2. The property holds for some candidates but not for all, so it is possible without being certain.

Reference solution as printed in the source (chapter 23, 4 steps):

1. If the secret is 4, the property “even” is true.
2. If it is 5, the property is false.
3. Therefore we cannot say it must be even.
4. But at least one candidate is even, so being even is possible.

## Result

**Answer.** It is not certainly even, but it may be even.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
