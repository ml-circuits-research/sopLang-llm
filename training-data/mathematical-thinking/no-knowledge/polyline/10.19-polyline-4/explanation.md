# Explanation 10.19 — Polyline 4

## Explanation

1. The polyline is traversed segment by segment, so its length is the total distance walked along it.
2. The stated rule says the segments are added one after another: 8 + 3 + 2 + 5.
3. Their sum is 18 cm.

Reference solution as printed in the source (chapter 10, 2 steps):

1. Add in pairs: 8+3=11 and 2+5=7.
2. Then 11+7=18.

## Result

**Answer.** 18 cm

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
