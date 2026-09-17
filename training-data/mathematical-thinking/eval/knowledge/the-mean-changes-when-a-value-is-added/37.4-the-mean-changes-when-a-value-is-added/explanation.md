# Explanation 37.4 — The mean changes when a value is added

## Explanation

1. The mean is not defined in this statement, so the solution applies the rule that it is the sum divided by the count.
2. The old values add to 10; adding 10 gives 20, and there are now 3 values.
3. The new mean is 20/3, which the book prints as 6⅔.

Reference solution as printed in the source (chapter 37, 4 steps):

1. The new sum is 20.
2. There are now 3 values.
3. The mean is 20/3, or 6 and 2/3.
4. The large added value raises the mean above 5.

## Result

**Answer.** 20/3 = 6⅔.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
