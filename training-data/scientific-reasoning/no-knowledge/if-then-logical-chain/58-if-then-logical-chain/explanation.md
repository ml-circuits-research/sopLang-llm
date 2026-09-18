# Explanation 58 — If-then logical chain

## Explanation

1. The completed premise is “the ice receives heat”, so the deduction begins at that state.
2. The rule that starts from the ice receives heat concludes the ice melts, and each later rule starts exactly from the state the previous rule concluded (the ice melts → liquid water receives more heat → part turns into vapor).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches part turns into vapor after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “the ice receives heat”; we apply the rule that starts exactly from this state and deduce “the ice melts”.
2. We have “the ice melts”; we apply the rule that starts exactly from this state and deduce “liquid water receives more heat”.
3. We have “liquid water receives more heat”; we apply the rule that starts exactly from this state and deduce “part turns into vapor”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: the ice receives heat → the ice melts → liquid water receives more heat → part turns into vapor.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
