# Explanation 83 — If-then logical chain

## Explanation

1. The completed premise is “we bring closer the magnet”, so the deduction begins at that state.
2. The rule that starts from we bring closer the magnet concludes the object enters the action zone, and each later rule starts exactly from the state the previous rule concluded (the object enters the action zone → attraction occurs → the object moves toward the magnet).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the object moves toward the magnet after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “we bring closer the magnet”; we apply the rule that starts exactly from this state and deduce “the object enters the action zone”.
2. We have “the object enters the action zone”; we apply the rule that starts exactly from this state and deduce “attraction occurs”.
3. We have “attraction occurs”; we apply the rule that starts exactly from this state and deduce “the object moves toward the magnet”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: we bring closer the magnet → the object enters the action zone → attraction occurs → the object moves toward the magnet.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
