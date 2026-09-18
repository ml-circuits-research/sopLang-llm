# Explanation 21 — If the front is present — night ward in Dunwick — case 1

## Explanation

1. The rule of Dunwick is a conditional whose antecedent is "arrives after 8:00" and whose consequent is "signs the late book and waits in the lobby".
2. Sam arrives at 9:10, so the antecedent is true and the consequent follows by modus ponens.
3. Tess arrives at 7:20, so the antecedent is false and this one sentence says nothing about that visitor.
4. Owen appeals to an empty lobby, but atmosphere is not a clause of the rule; only a written exception could release the consequent.

Reference solution as printed in the source (section 3, 5 steps):

1. If A then B; A; therefore B.
2. A is “arrives after 8:00.” For Sam, A is true.
3. For Tess, A is false, so this rule is silent.
4. Atmosphere is not a clause.
5. Sufficient conditions are not moods.

## Result

**Answer.** Sam must sign and wait (modus ponens). Tess is not covered by this sentence. An empty lobby is not a written exception.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
