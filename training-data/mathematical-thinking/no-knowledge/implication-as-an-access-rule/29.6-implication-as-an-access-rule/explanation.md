# Explanation 29.6 — Implication as an access rule

## Explanation

1. The rule is the implication "has a VIP badge implies may enter through door A".
2. The problem states the antecedent directly: Ana has the badge.
3. Modus ponens then guarantees the consequent, so the single guaranteed conclusion is the action, and nothing stronger may be claimed.

Reference solution as printed in the source (chapter 29, 4 steps):

1. The rule applies to everyone with a VIP badge.
2. Ana satisfies the “if” condition.
3. Therefore the “then” part applies.
4. Ana may enter through door A.

## Result

**Answer.** Ana may enter through door A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
