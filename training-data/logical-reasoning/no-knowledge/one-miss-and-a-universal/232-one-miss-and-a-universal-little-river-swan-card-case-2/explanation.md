# Explanation 232 — One miss and a universal — Little River swan card — case 2

## Explanation

1. The card in Little River records the strict universal “all swans are white,” and the later page shows one black swan, which is a listed counterexample of exactly that sentence.
2. Ben is right that the universal dies with that one case, while Cara would keep a corpse standing.
3. Nia lets the same miss also finish “most swans in this region are white,” but a “most” claim was never on the card: the weapon must match the claim.

Reference solution as printed in the source (section 24, 5 steps):

1. A universal dies with one listed counterexample.
2. A “most” claim was not made.
3. Match the weapon to the claim.
4. Stubbornness treats a corpse as standing.
5. Panic treats every pattern as a universal.

## Result

**Answer.** The strict universal “all swans are white.” It does not, by itself, refute a statistical sentence that was not on the card.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
