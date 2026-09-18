# Explanation 168 — The till commission — variant 8

## Explanation

1. The notice makes the commission a percentage of the seller price, so 12% of 225 is 27.00, paid by the buyer on top of the price rather than taken out of it.
2. The home total is the seller price plus that commission plus the stated delivery fee of 18, which gives 270.00.
3. The pick-up total adds the same commission to the price without a delivery fee, so Tess pays 252.00 at the pick-up point in Harbour Town, the difference being exactly the delivery fee.

Reference material as printed in the source:

The percent is not applied to the 18: the base is “seller price”. Delivery is a separate line.

## Result

**Answer.** Commission 27.00. Home 270.00. Pick-up 252.00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
