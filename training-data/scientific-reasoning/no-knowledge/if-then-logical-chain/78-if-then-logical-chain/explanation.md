# Explanation 78 — If-then logical chain

## Explanation

1. The completed premise is “we apply a push”, so the deduction begins at that state.
2. The rule that starts from we apply a push concludes the object begins to move, and each later rule starts exactly from the state the previous rule concluded (the object begins to move → friction opposes motion → the object slows down).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the object slows down after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “we apply a push”; we apply the rule that starts exactly from this state and deduce “the object begins to move”.
2. We have “the object begins to move”; we apply the rule that starts exactly from this state and deduce “friction opposes motion”.
3. We have “friction opposes motion”; we apply the rule that starts exactly from this state and deduce “the object slows down”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: we apply a push → the object begins to move → friction opposes motion → the object slows down.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
