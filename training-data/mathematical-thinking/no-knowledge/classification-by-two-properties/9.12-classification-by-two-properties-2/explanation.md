# Explanation 9.12 — Classification by Two Properties 2

## Explanation

1. A card is selected only when both conditions hold at once: shape “round” and color “green”.
2. Scanning the 8 cards and keeping only those that satisfy the shape and the color together selects 2 cards.
3. Every other card fails at least one of the two conditions, so the conjunction is what makes the selection.

Reference solution as printed in the source (chapter 9, 3 steps):

1. Go through the list and keep only cards with shape round.
2. Among these, keep only those with color green.
3. The number of cards that pass both filters is 2.

## Result

**Answer.** 2

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
