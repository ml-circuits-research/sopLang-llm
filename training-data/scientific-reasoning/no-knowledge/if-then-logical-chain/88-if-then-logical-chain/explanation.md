# Explanation 88 — If-then logical chain

## Explanation

1. The completed premise is “we connect the battery”, so the deduction begins at that state.
2. The rule that starts from we connect the battery concludes we close the path through the wires, and each later rule starts exactly from the state the previous rule concluded (we close the path through the wires → the path passes through the bulb → the bulb lights up).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the bulb lights up after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “we connect the battery”; we apply the rule that starts exactly from this state and deduce “we close the path through the wires”.
2. We have “we close the path through the wires”; we apply the rule that starts exactly from this state and deduce “the path passes through the bulb”.
3. We have “the path passes through the bulb”; we apply the rule that starts exactly from this state and deduce “the bulb lights up”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: we connect the battery → we close the path through the wires → the path passes through the bulb → the bulb lights up.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
