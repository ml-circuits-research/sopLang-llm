# Explanation 113 — If-then logical chain

## Explanation

1. The completed premise is “the pollutant enters the stream”, so the deduction begins at that state.
2. The rule that starts from the pollutant enters the stream concludes the water carries it downstream, and each later rule starts exactly from the state the previous rule concluded (the water carries it downstream → downstream organisms have been exposed → effects may appear farther from the source).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches effects may appear farther from the source after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “the pollutant enters the stream”; we apply the rule that starts exactly from this state and deduce “the water carries it downstream”.
2. We have “the water carries it downstream”; we apply the rule that starts exactly from this state and deduce “downstream organisms have been exposed”.
3. We have “downstream organisms have been exposed”; we apply the rule that starts exactly from this state and deduce “effects may appear farther from the source”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: the pollutant enters the stream → the water carries it downstream → downstream organisms have been exposed → effects may appear farther from the source.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
