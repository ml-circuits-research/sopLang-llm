# Explanation 98 — If-then logical chain

## Explanation

1. The completed premise is “water evaporates”, so the deduction begins at that state.
2. The rule that starts from water evaporates concludes the vapor rises, and each later rule starts exactly from the state the previous rule concluded (the vapor rises → the vapor cools and condenses → the droplets can fall and be collected).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the droplets can fall and be collected after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “water evaporates”; we apply the rule that starts exactly from this state and deduce “the vapor rises”.
2. We have “the vapor rises”; we apply the rule that starts exactly from this state and deduce “the vapor cools and condenses”.
3. We have “the vapor cools and condenses”; we apply the rule that starts exactly from this state and deduce “the droplets can fall and be collected”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: water evaporates → the vapor rises → the vapor cools and condenses → the droplets can fall and be collected.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
