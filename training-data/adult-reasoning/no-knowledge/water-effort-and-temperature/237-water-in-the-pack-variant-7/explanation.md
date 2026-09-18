# Explanation 237 — Water in the pack — variant 7

## Explanation

1. The guide, printed for Station Quarter, rounds the mass up to the next 10 kg step, so 79 kg gives 8 steps and 3.2 l of base reserve.
2. Noon is 30 °C, above the 28 °C threshold, so the heat block is 0.5 l.
3. The route is 12 km against the 15 km threshold, so the effort block is 0 l; the sum is 3.7 l.
4. The 0.5 l drunk in the morning is explicitly excluded from the pack, and the 150 ml pauses are drunk from the pack rather than carried on top of it.

Reference material as printed in the source:

Round 79 → 8 tens. Additions are independent. Pauses do not triple the stock. Counting the morning water twice is forbidden by the guide.

## Result

**Answer.** 3.2 + 0.5 (heat) + 0 (12≤15) = 3.7 l. Morning water is explicitly excluded.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
