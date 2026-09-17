# Explanation 10.17 — Polyline 2

## Explanation

1. The polyline is traversed segment by segment, so its length is the total distance walked along it.
2. The stated rule says the segments are added one after another: 6 + 2 + 7 + 3.
3. Their sum is 18 cm.

Reference solution as printed in the source (chapter 10, 2 steps):

1. Add in pairs: 6+2=8 and 7+3=10.
2. Then 8+10=18.

## Result

**Answer.** 18 cm

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
