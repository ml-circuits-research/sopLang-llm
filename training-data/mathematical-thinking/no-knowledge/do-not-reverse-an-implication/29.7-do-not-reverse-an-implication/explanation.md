# Explanation 29.7 — Do not reverse an implication

## Explanation

1. The rule only runs forward: "VIP badge" implies "enter through door A".
2. What we observe is the consequent "enter through door A", and the text adds that staff reach the same door without the badge, so the consequent has other causes.
3. A consequent cannot be reversed into its antecedent unless the implication is an equivalence, so nothing about the badge follows and the answer is no.

Reference solution as printed in the source (chapter 29, 4 steps):

1. The rule guarantees access for VIP holders.
2. It does not say VIP is the only way to gain access.
3. Staff provide a possible counterexample to the reversed implication.
4. Access alone does not force VIP status.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
