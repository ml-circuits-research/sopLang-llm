# Explanation 17.21 — Two Stages with Fractions, Different Reference Wholes 1

## Explanation

1. The statement makes the reference explicit: each fraction is calculated from the quantity mentioned immediately before it, so the two fractions do not share a denominator here.
2. The first stage uses 2/5 of 60, which is 24 units, leaving 36 units.
3. The second fraction is taken from that remainder, not from the original total: 1/3 of 36 is 12 units.

Reference solution as printed in the source (chapter 17, 3 steps):

1. First stage: 60÷5=12, apoi ×2=24.
2. Remainder: 60-24=36.
3. The second fraction applies to the remainder: 36÷3=12, apoi ×1=12.

## Result

**Answer.** 12

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
