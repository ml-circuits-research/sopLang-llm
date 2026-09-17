# Explanation 38.25 — Base-ten and base-two representation

## Explanation

1. The two notations are different ways of writing numbers, so the same value can appear in both.
2. Evaluating the binary form 101 with the weights 4, 2, 1 gives 5.
3. That equals the decimal value 5, so the representations differ but the value is the same.

Reference solution as printed in the source (chapter 38, 4 steps):

1. Decimal code 5 denotes the value 5.
2. Code 101 with weights 4, 2, 1 has value 4+1=5.
3. The symbol strings are different.
4. The represented value is the same.

## Result

**Answer.** No; both represent the value 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
