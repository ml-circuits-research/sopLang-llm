# Explanation 10.18 — Polyline 3

## Explanation

1. The polyline is traversed segment by segment, so its length is the total distance walked along it.
2. The stated rule says the segments are added one after another: 4 + 4 + 5 + 6.
3. Their sum is 19 cm.

Reference solution as printed in the source (chapter 10, 2 steps):

1. Add in pairs: 4+4=8 and 5+6=11.
2. Then 8+11=19.

## Result

**Answer.** 19 cm

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
