# Explanation 17.24 — Two Stages with Fractions, Different Reference Wholes 4

## Explanation

1. The statement makes the reference explicit: each fraction is calculated from the quantity mentioned immediately before it, so the two fractions do not share a denominator here.
2. The first stage uses 4/9 of 90, which is 40 units, leaving 50 units.
3. The second fraction is taken from that remainder, not from the original total: 1/5 of 50 is 10 units.

Reference solution as printed in the source (chapter 17, 3 steps):

1. First stage: 90÷9=10, apoi ×4=40.
2. Remainder: 90-40=50.
3. The second fraction applies to the remainder: 50÷5=10, apoi ×1=10.

## Result

**Answer.** 10

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
