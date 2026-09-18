# Explanation 838 — The overlapping interval — variant 8

## Explanation

1. Elena will not go under 470 and Farid will not go over 520, so the two written intervals share the range 470 to 520.
2. The sheet's own rule says an overlap leaves room, and the middle of that shared range, 495, belongs to both sides at once.
3. The object is single and the payment is cash today, so the example keeps that condition instead of proposing instalments or a second object.
4. Any figure from 470 to 520 would satisfy both limits; 495 is the one printed because it is the shared middle.

Reference material as printed in the source:

Min {a} ≤ max {b}. Without cash today, the price overlap does not save the deal. Negotiation with constraints is the geometry of intervals.

## Result

**Answer.** Yes, [470, 520]. Example: 495 cash today.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
