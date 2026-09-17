# Explanation 26.20 — How many occurrences by a date?

## Explanation

1. The inspections form the arithmetic progression 1, 4, 7, 10, ..., with period 3 days.
2. Counting the terms up to and including day 13 means finding how many whole periods of 3 fit between the first inspection on day 1 and that day.
3. 12 days fit 4 whole periods after the first term, so 5 inspections occur in total.

Reference solution as printed in the source (chapter 26, 4 steps):

1. Start with day 1.
2. Repeatedly add 3: 4,7,10,13.
3. The next would be 16, which is beyond 13.
4. We counted 5 allowed dates.

## Result

**Answer.** 5 inspections.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
