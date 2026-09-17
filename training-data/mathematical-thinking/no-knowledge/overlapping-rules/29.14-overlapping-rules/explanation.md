# Explanation 29.14 — Overlapping rules

## Explanation

1. The rules have no "else" branch, so they are independent tests and every true condition contributes a label.
2. The value 6 satisfies 2 of the conditions at the same time.
3. Because the two tests overlap on the value, both labels are assigned and the answer counts two.

Reference solution as printed in the source (chapter 29, 4 steps):

1. Test the first condition: 6≥5, so A.
2. Test the second independently: 6≤7, so B.
3. There is no rule that stops after the first match.
4. The number receives both labels.

## Result

**Answer.** Two: A and B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
