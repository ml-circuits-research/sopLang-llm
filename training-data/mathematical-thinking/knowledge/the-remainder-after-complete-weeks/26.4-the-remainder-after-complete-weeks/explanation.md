# Explanation 26.4 — The remainder after complete weeks

## Explanation

1. The text states 7-day weeks, so 17 days can be split into complete weeks plus a remainder.
2. 17 modulo 7 is 3, and only that remainder can change the weekday.
3. Stepping 3 weekday positions forward from Monday on the cycle read from the fact table gives Thursday.

Reference solution as printed in the source (chapter 26, 4 steps):

1. 14 days are two complete weeks and bring us back to Monday.
2. 3 days remain.
3. Tuesday is +1, Wednesday +2, Thursday +3.
4. The result is Thursday.

## Result

**Answer.** Thursday.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
