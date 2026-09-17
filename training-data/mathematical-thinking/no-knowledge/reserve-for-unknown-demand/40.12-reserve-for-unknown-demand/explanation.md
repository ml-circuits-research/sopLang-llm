# Explanation 40.12 — Reserve for unknown demand

## Explanation

1. The demand can be anything from 8 to 12 units, so a stock level only guarantees coverage when it covers every value in that range.
2. Covering the whole range means covering its largest value, because any smaller stock would fail when the demand reaches the top of the range.
3. The minimum stock that is sufficient in every case is therefore 12 units.

Reference solution as printed in the source (chapter 40, 4 steps):

1. If stock is below 12, the scenario with demand 12 would create a shortage.
2. Stock 12 covers every value from 8 to 12.
3. No more is needed for the requested guarantee.
4. The minimum robust stock is 12.

## Result

**Answer.** 12 units.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
