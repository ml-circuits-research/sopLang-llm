# Explanation 43 — If-then logical chain

## Explanation

1. The completed premise is “microbes reach the surface”, so the deduction begins at that state.
2. The rule that starts from microbes reach the surface concludes has transferred onto the hands, and each later rule starts exactly from the state the previous rule concluded (has transferred onto the hands → hands touch the mouth → microbes can enters body).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches microbes can enters body after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “microbes reach the surface”; we apply the rule that starts exactly from this state and deduce “has transferred onto the hands”.
2. We have “has transferred onto the hands”; we apply the rule that starts exactly from this state and deduce “hands touch the mouth”.
3. We have “hands touch the mouth”; we apply the rule that starts exactly from this state and deduce “microbes can enters body”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: microbes reach the surface → has transferred onto the hands → hands touch the mouth → microbes can enters body.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
