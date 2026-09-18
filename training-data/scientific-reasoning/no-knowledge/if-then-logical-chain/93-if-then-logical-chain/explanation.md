# Explanation 93 — If-then logical chain

## Explanation

1. The completed premise is “we pour water onto the soil”, so the deduction begins at that state.
2. The rule that starts from we pour water onto the soil concludes water enters the spaces between particles, and each later rule starts exactly from the state the previous rule concluded (water enters the spaces between particles → a part is retained → the remainder drains away).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the remainder drains away after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “we pour water onto the soil”; we apply the rule that starts exactly from this state and deduce “water enters the spaces between particles”.
2. We have “water enters the spaces between particles”; we apply the rule that starts exactly from this state and deduce “a part is retained”.
3. We have “a part is retained”; we apply the rule that starts exactly from this state and deduce “the remainder drains away”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: we pour water onto the soil → water enters the spaces between particles → a part is retained → the remainder drains away.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
