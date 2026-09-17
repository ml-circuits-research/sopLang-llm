# Explanation 39.18 — Proving that two formulas give the same result

## Explanation

1. Grouping equal terms turns the first sum into twice the first length plus twice the second length.
2. Factoring out the common 2 gives exactly the second formula, so the two formulas agree for all side lengths.

Reference solution as printed in the source (chapter 39, 4 steps):

1. Group equal sides: a+a and b+b.
2. We obtain 2a+2b.
3. Factor out the common factor 2.
4. The result is 2(a+b).

## Result

**Answer.** The formulas are equivalent.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
