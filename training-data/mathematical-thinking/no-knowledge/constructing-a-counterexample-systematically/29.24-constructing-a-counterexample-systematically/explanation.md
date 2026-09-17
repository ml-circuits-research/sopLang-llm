# Explanation 29.24 — Constructing a counterexample systematically

## Explanation

1. A counterexample must make the hypothesis true and the conclusion false: it must be > 5 while failing to be even.
2. Testing each candidate against the hypothesis first discards the numbers that do not even trigger the rule.
3. The remaining candidate that is not even falsifies the universal claim and is the counterexample.

Reference solution as printed in the source (chapter 29, 4 steps):

1. All three are greater than 5.
2. 6 is even, so it does not contradict the rule.
3. 7 is odd, so it satisfies the premise but violates the conclusion.
4. One counterexample is sufficient.

## Result

**Answer.** 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
