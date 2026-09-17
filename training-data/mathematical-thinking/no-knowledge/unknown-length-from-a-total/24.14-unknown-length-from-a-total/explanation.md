# Explanation 24.14 — Unknown length from a total

## Explanation

1. The two boards placed end to end add up to 150 cm, and the first board accounts for 90 cm of that total.
2. The second board is the part the first does not cover, 150 - 90 = 60 cm, and adding it back returns the total.

Reference solution as printed in the source (chapter 24, 4 steps):

1. The total length is the sum of the two boards.
2. The second board must complete the length from 90 to 150.
3. 150−90=60.
4. Check: 90+60=150.

## Result

**Answer.** 60 cm.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
