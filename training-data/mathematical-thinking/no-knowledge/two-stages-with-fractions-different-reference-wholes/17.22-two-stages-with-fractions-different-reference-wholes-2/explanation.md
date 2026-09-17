# Explanation 17.22 — Two Stages with Fractions, Different Reference Wholes 2

## Explanation

1. The statement makes the reference explicit: each fraction is calculated from the quantity mentioned immediately before it, so the two fractions do not share a denominator here.
2. The first stage uses 2/6 of 72, which is 24 units, leaving 48 units.
3. The second fraction is taken from that remainder, not from the original total: 1/4 of 48 is 12 units.

Reference solution as printed in the source (chapter 17, 3 steps):

1. First stage: 72÷6=12, apoi ×2=24.
2. Remainder: 72-24=48.
3. The second fraction applies to the remainder: 48÷4=12, apoi ×1=12.

## Result

**Answer.** 12

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
