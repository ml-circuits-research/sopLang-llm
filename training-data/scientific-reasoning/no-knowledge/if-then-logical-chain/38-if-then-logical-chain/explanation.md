# Explanation 38 — If-then logical chain

## Explanation

1. The completed premise is “the receptor detects the stimulus”, so the deduction begins at that state.
2. The rule that starts from the receptor detects the stimulus concludes the signal starts, and each later rule starts exactly from the state the previous rule concluded (the signal starts → the signal is interpreted → the muscle performs the response).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the muscle performs the response after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “the receptor detects the stimulus”; we apply the rule that starts exactly from this state and deduce “the signal starts”.
2. We have “the signal starts”; we apply the rule that starts exactly from this state and deduce “the signal is interpreted”.
3. We have “the signal is interpreted”; we apply the rule that starts exactly from this state and deduce “the muscle performs the response”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: the receptor detects the stimulus → the signal starts → the signal is interpreted → the muscle performs the response.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
