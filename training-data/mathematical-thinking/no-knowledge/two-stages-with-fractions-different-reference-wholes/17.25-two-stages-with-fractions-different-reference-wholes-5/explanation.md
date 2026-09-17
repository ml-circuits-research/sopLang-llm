# Explanation 17.25 — Two Stages with Fractions, Different Reference Wholes 5

## Explanation

1. The statement makes the reference explicit: each fraction is calculated from the quantity mentioned immediately before it, so the two fractions do not share a denominator here.
2. The first stage uses 3/10 of 100, which is 30 units, leaving 70 units.
3. The second fraction is taken from that remainder, not from the original total: 2/7 of 70 is 20 units.

Reference solution as printed in the source (chapter 17, 3 steps):

1. First stage: 100÷10=10, apoi ×3=30.
2. Remainder: 100-30=70.
3. The second fraction applies to the remainder: 70÷7=10, apoi ×2=20.

## Result

**Answer.** 20

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
