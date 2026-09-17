# Explanation 36.18 — Converting a rate across equal intervals

## Explanation

1. The rate is stated per minute, while the question asks for one hour.
2. The convention that one hour contains 60 minutes is external knowledge, so it is carried in the facts wire instead of being read from the text.
3. Multiplying 2 pieces/min by 60 minutes gives 120 pieces/hour.

Reference solution as printed in the source (chapter 36, 4 steps):

1. One hour contains 60 minutes.
2. In each minute, 2 pieces are made.
3. 2×60=120.
4. The unit becomes pieces/hour.

## Result

**Answer.** 120 pieces/hour.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
