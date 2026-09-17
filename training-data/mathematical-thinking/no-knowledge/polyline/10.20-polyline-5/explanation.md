# Explanation 10.20 — Polyline 5

## Explanation

1. The polyline is traversed segment by segment, so its length is the total distance walked along it.
2. The stated rule says the segments are added one after another: 7 + 6 + 3 + 4.
3. Their sum is 20 cm.

Reference solution as printed in the source (chapter 10, 2 steps):

1. Add in pairs: 7+6=13 and 3+4=7.
2. Then 13+7=20.

## Result

**Answer.** 20 cm

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
