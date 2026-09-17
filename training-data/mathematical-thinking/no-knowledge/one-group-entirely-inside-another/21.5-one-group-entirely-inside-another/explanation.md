# Explanation 21.5 — One Group Entirely Inside Another

## Explanation

1. The rule "all gold pieces are metallic" says the 3 gold pieces are already counted among the 8 metallic pieces.
2. Metallic pieces that are not gold are the metallic group with the gold group removed.
3. That leaves 8 - 3 = 5 pieces.

Reference solution as printed in the source (chapter 21, 4 steps):

1. The 3 gold pieces are included in the total of 8 metallic pieces.
2. Do not add 3+8, because that would count the gold pieces separately even though they are already in the metallic group.
3. Metallic but not gold: 8-3=5.
4. Check: 3 gold + 5 metallic-not-gold = 8 metallic pieces.

## Result

**Answer.** 5 pieces.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
