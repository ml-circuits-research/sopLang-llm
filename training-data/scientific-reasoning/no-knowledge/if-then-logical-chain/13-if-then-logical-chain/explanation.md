# Explanation 13 — If-then logical chain

## Explanation

1. The completed premise is “plants grow”, so the deduction begins at that state.
2. The rule that starts from plants grow concludes the rabbit eats plants, and each later rule starts exactly from the state the previous rule concluded (the rabbit eats plants → the fox finds the rabbit → energy from food reaches the fox).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches energy from food reaches the fox after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “plants grow”; we apply the rule that starts exactly from this state and deduce “the rabbit eats plants”.
2. We have “the rabbit eats plants”; we apply the rule that starts exactly from this state and deduce “the fox finds the rabbit”.
3. We have “the fox finds the rabbit”; we apply the rule that starts exactly from this state and deduce “energy from food reaches the fox”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: plants grow → the rabbit eats plants → the fox finds the rabbit → energy from food reaches the fox.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
