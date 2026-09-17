# Explanation 34.18 — Safety reserve

## Explanation

1. If x litres are put in, the empty space is 100 − x, and the rule requires it to stay at least 10 litres.
2. So 100 − x ≥ 10, which rearranges to x ≤ 90.
3. The largest amount satisfying the rule is therefore 90 L.

Reference solution as printed in the source (chapter 34, 4 steps):

1. Empty space must be at least 10.
2. Subtract the 10-unit reserve from 100.
3. 90 remain for the contents.
4. At 90, exactly 10 remain empty.

## Result

**Answer.** 90 L.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
