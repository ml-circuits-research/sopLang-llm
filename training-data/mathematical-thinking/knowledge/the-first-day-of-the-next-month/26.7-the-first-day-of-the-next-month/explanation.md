# Explanation 26.7 — The first day of the next month

## Explanation

1. The day after date 30 is the new date 1, so the two first days of the month are exactly 30 days apart.
2. Only 30 modulo seven matters for the weekday, and that shift is 2 days.
3. Shifting Tuesday by 2 positions in the weekday order from the fact table gives Thursday for the start of the next month.

Reference solution as printed in the source (chapter 26, 4 steps):

1. From one date 1 to the next date 1, 30 days pass.
2. 28 of them are four complete weeks.
3. 2 days remain.
4. Tuesday +2 days = Thursday.

## Result

**Answer.** Thursday.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
