# Explanation 21.20 — Pairs with Different Types of Partners

## Explanation

1. Every pair consumes one button of each type, so the number of pairs cannot exceed either group.
2. The smaller group (3) is used up completely, giving 3 pairs.
3. The difference between the two counts leaves 2 round buttons with no partner.

Reference solution as printed in the source (chapter 21, 4 steps):

1. We have only 3 square buttons, so we cannot form more than 3 mixed pairs.
2. Use 3 round buttons together with the 3 square buttons.
3. 5-3=2 round buttons remain.
4. All square buttons have been used.

## Result

**Answer.** 3 pairs; 2 round buttons remain.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
