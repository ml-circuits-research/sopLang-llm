# Explanation 123 — If-then logical chain

## Explanation

1. The completed premise is “we define what we measure”, so the deduction begins at that state.
2. The rule that starts from we define what we measure concludes we choose the instrument and unit, and each later rule starts exactly from the state the previous rule concluded (we choose the instrument and unit → we measure several times → we compare values).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches we compare values after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “we define what we measure”; we apply the rule that starts exactly from this state and deduce “we choose the instrument and unit”.
2. We have “we choose the instrument and unit”; we apply the rule that starts exactly from this state and deduce “we measure several times”.
3. We have “we measure several times”; we apply the rule that starts exactly from this state and deduce “we compare values”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: we define what we measure → we choose the instrument and unit → we measure several times → we compare values.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
