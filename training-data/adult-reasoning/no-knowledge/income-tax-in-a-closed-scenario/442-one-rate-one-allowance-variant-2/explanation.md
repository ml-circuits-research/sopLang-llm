# Explanation 442 — One rate, one allowance — variant 2

## Explanation

1. The scenario defines the taxable income as the gross minus 215, so Ned’s gross of 4200 gives a base of 3985.
2. The only rate on the page is 10% of the taxable base, so the tax is 398.50 and no other allowance enters the computation.
3. The scenario is a closed course example, and "No other allowances" stops any real tax code from being imported into it.

Reference material as printed in the source:

Do not import rates from real life. “No other allowances” stops creativity.

## Result

**Answer.** Base 3985. Tax 398.50.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
