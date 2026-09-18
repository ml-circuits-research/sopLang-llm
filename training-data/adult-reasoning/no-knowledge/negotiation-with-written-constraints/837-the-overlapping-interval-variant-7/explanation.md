# Explanation 837 — The overlapping interval — variant 7

## Explanation

1. Ann will not go under 460 and Ben will not go over 510, so the two written intervals share the range 460 to 510.
2. The sheet's own rule says an overlap leaves room, and the middle of that shared range, 485, belongs to both sides at once.
3. The object is single and the payment is cash today, so the example keeps that condition instead of proposing instalments or a second object.
4. Any figure from 460 to 510 would satisfy both limits; 485 is the one printed because it is the shared middle.

Reference material as printed in the source:

Min {a} ≤ max {b}. Without cash today, the price overlap does not save the deal. Negotiation with constraints is the geometry of intervals.

## Result

**Answer.** Yes, [460, 510]. Example: 485 cash today.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
