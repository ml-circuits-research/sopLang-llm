# Explanation 10.16 — Polyline 1

## Explanation

1. The polyline is traversed segment by segment, so its length is the total distance walked along it.
2. The stated rule says the segments are added one after another: 3 + 5 + 4 + 2.
3. Their sum is 14 cm.

Reference solution as printed in the source (chapter 10, 2 steps):

1. Add in pairs: 3+5=8 and 4+2=6.
2. Then 8+6=14.

## Result

**Answer.** 14 cm

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
