# Explanation 102 — Three items and a note — variant 2

## Explanation

1. The order at the Bridge City kiosk costs 3×5 + 2×9 + 3×3 = 42, all at whole-crown prices, so nothing has to be rounded.
2. Elena tenders 55 and the seller has change, so the change is 13, and the tip/extra-item/exact-sum rule for a purchase without change never comes up.
3. A single water costs 3, which is below the 20 floor the kiosk refuses cards under, so the answer is that a card would not be accepted for it.

Reference material as printed in the source:

3×5 + 2×9 + 3×3 = 42. Change 55−42=13. The no-change branches do not open. The card rule is a threshold, not a courtesy.

## Result

**Answer.** Cost 42, change 13. One water at 3 < 20 → card refused.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
