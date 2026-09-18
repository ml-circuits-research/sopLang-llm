# Explanation 167 — The till commission — variant 7

## Explanation

1. The notice makes the commission a percentage of the seller price, so 11% of 210 is 23.10, paid by the buyer on top of the price rather than taken out of it.
2. The home total is the seller price plus that commission plus the stated delivery fee of 18, which gives 251.10.
3. The pick-up total adds the same commission to the price without a delivery fee, so Olga pays 233.10 at the pick-up point in Bridge City, the difference being exactly the delivery fee.

Reference material as printed in the source:

The percent is not applied to the 18: the base is “seller price”. Delivery is a separate line.

## Result

**Answer.** Commission 23.10. Home 251.10. Pick-up 233.10.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
