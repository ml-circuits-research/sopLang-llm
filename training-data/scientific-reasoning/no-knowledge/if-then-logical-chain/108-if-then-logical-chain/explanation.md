# Explanation 108 — If-then logical chain

## Explanation

1. The completed premise is “the rock breaks into fragments”, so the deduction begins at that state.
2. The rule that starts from the rock breaks into fragments concludes the fragments have been transported, and each later rule starts exactly from the state the previous rule concluded (the fragments have been transported → the fragments have been deposited → forms layers of sediment).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches forms layers of sediment after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “the rock breaks into fragments”; we apply the rule that starts exactly from this state and deduce “the fragments have been transported”.
2. We have “the fragments have been transported”; we apply the rule that starts exactly from this state and deduce “the fragments have been deposited”.
3. We have “the fragments have been deposited”; we apply the rule that starts exactly from this state and deduce “forms layers of sediment”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: the rock breaks into fragments → the fragments have been transported → the fragments have been deposited → forms layers of sediment.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
