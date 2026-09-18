# Explanation 18 — If-then logical chain

## Explanation

1. The completed premise is “the animal finds shelter”, so the deduction begins at that state.
2. The rule that starts from the animal finds shelter concludes avoids the hours very hot, and each later rule starts exactly from the state the previous rule concluded (avoids the hours very hot → finds water → goes out to look for food).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches goes out to look for food after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “the animal finds shelter”; we apply the rule that starts exactly from this state and deduce “avoids the hours very hot”.
2. We have “avoids the hours very hot”; we apply the rule that starts exactly from this state and deduce “finds water”.
3. We have “finds water”; we apply the rule that starts exactly from this state and deduce “goes out to look for food”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: the animal finds shelter → avoids the hours very hot → finds water → goes out to look for food.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
