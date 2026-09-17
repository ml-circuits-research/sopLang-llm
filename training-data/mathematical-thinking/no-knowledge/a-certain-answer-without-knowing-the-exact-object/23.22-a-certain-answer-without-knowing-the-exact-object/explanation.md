# Explanation 23.22 — A certain answer without knowing the exact object

## Explanation

1. The candidates are 4 and 6, and the property "even" is tested on each of them.
2. Every candidate has the property, so it is certain even though the exact number is unknown.

Reference solution as printed in the source (chapter 23, 4 steps):

1. 4 can be divided into two pairs.
2. 6 can be divided into three pairs.
3. The exact identity remains unknown.
4. But the property is shared by all possibilities, so it can be asserted with certainty.

## Result

**Answer.** Yes, it is certainly even.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
