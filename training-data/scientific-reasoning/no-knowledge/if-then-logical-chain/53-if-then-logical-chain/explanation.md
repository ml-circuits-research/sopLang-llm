# Explanation 53 — If-then logical chain

## Explanation

1. The completed premise is “we use the magnet”, so the deduction begins at that state.
2. The rule that starts from we use the magnet concludes we use the sieve, and each later rule starts exactly from the state the previous rule concluded (we use the sieve → we filter the liquid → we evaporate the water).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches we evaporate the water after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “we use the magnet”; we apply the rule that starts exactly from this state and deduce “we use the sieve”.
2. We have “we use the sieve”; we apply the rule that starts exactly from this state and deduce “we filter the liquid”.
3. We have “we filter the liquid”; we apply the rule that starts exactly from this state and deduce “we evaporate the water”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: we use the magnet → we use the sieve → we filter the liquid → we evaporate the water.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
