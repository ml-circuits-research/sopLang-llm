# Explanation 161 — The till commission — variant 1

## Explanation

1. The notice makes the commission a percentage of the seller price, so 5% of 120 is 6.00, paid by the buyer on top of the price rather than taken out of it.
2. The home total is the seller price plus that commission plus the stated delivery fee of 18, which gives 144.00.
3. The pick-up total adds the same commission to the price without a delivery fee, so Kara pays 126.00 at the pick-up point in Maple Ward, the difference being exactly the delivery fee.

Reference material as printed in the source:

The percent is not applied to the 18: the base is “seller price”. Delivery is a separate line.

## Result

**Answer.** Commission 6.00. Home 144.00. Pick-up 126.00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
