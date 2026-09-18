# Explanation 198 — The total that enriched itself — variant 8

## Explanation

1. Ned rebuilds the product in the notice from Forest Parish, and 13 jars at 19 each give 247.
2. The printed total is 262, which is 15 higher, not lower than the product, so the notice overstates the sum rather than cutting it.
3. A saving against the each price would have to be a total below 247, and the advertised 15 is exactly the discrepancy in the other direction, so the "saving" is the sign flipped.

Reference material as printed in the source:

Always rebuild n × p. If the notice does not match, it does not get the benefit of the doubt. Here the “saving” was added instead of subtracted.

## Result

**Answer.** The correct product is 247. The notice is 15 higher, not lower. The “saving” is the sign flipped.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
