# Explanation 90 — The “from” price and the photo — variant 10

## Explanation

1. The Forest Parish leaflet prints only a from-price for the Start model in its large type, and Ned asked for what the cover shows, which the small type says is the Plus model with a case.
2. The card discount does not stack with this from-price, so the expected 334 minus 15% is not the sum the buyer owes, and the card stays out of the calculation.
3. The Plus costs 414, which is at or above the 300 delivery threshold, so delivery is 0 and the sum is 414.

Reference material as printed in the source:

“From-price” is Start. The picture is Plus. The card is excluded from stacking. The 300 threshold decides delivery (414 ≥ 300). Ned’s expectation glued together three things the leaflet keeps apart.

## Result

**Answer.** Plus, 414 + delivery 0 = 414. No 15%.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
