# Explanation 22.19 — The smallest bounding region

## Explanation

1. An axis-aligned rectangle containing all objects must span every row and every column that any object occupies.
2. The smallest such rectangle reaches from the lowest object row to the highest and from the leftmost column to the rightmost.

Reference solution as printed in the source (chapter 22, 4 steps):

1. The smallest row used by any object is 2.
2. The largest row is 5.
3. The smallest and largest columns are 3 and 8.
4. Any smaller interval would exclude at least one object.

## Result

**Answer.** Rows 2–5 and columns 3–8.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
