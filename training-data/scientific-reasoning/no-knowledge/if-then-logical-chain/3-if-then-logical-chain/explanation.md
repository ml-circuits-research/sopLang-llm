# Explanation 3 — If-then logical chain

## Explanation

1. The completed premise is “the seed absorbs water”, so the deduction begins at that state.
2. The rule that starts from the seed absorbs water concludes the seed coat softens, and each later rule starts exactly from the state the previous rule concluded (the seed coat softens → the young root emerges → the shoot appears).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the shoot appears after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “the seed absorbs water”; we apply the rule that starts exactly from this state and deduce “the seed coat softens”.
2. We have “the seed coat softens”; we apply the rule that starts exactly from this state and deduce “the young root emerges”.
3. We have “the young root emerges”; we apply the rule that starts exactly from this state and deduce “the shoot appears”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: the seed absorbs water → the seed coat softens → the young root emerges → the shoot appears.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
