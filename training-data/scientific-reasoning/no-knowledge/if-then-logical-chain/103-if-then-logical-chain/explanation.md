# Explanation 103 — If-then logical chain

## Explanation

1. The completed premise is “the location is in zone illuminated”, so the deduction begins at that state.
2. The rule that starts from the location is in zone illuminated concludes Earth rotates, and each later rule starts exactly from the state the previous rule concluded (Earth rotates → the location reaches toward the edge of the zone illuminated → the location enters zone of night).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the location enters zone of night after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “the location is in zone illuminated”; we apply the rule that starts exactly from this state and deduce “Earth rotates”.
2. We have “Earth rotates”; we apply the rule that starts exactly from this state and deduce “the location reaches toward the edge of the zone illuminated”.
3. We have “the location reaches toward the edge of the zone illuminated”; we apply the rule that starts exactly from this state and deduce “the location enters zone of night”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: the location is in zone illuminated → Earth rotates → the location reaches toward the edge of the zone illuminated → the location enters zone of night.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
