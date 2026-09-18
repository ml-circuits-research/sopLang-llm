# Explanation 118 — If-then logical chain

## Explanation

1. The completed premise is “we choose the food”, so the deduction begins at that state.
2. The rule that starts from we choose the food concludes the food is digested, and each later rule starts exactly from the state the previous rule concluded (the food is digested → nutrients have been absorbed → the body can use them).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the body can use them after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “we choose the food”; we apply the rule that starts exactly from this state and deduce “the food is digested”.
2. We have “the food is digested”; we apply the rule that starts exactly from this state and deduce “nutrients have been absorbed”.
3. We have “nutrients have been absorbed”; we apply the rule that starts exactly from this state and deduce “the body can use them”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: we choose the food → the food is digested → nutrients have been absorbed → the body can use them.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
