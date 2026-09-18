# Explanation 28 — If-then logical chain

## Explanation

1. The completed premise is “the mouth breaks up food”, so the deduction begins at that state.
2. The rule that starts from the mouth breaks up food concludes food reaches the stomach, and each later rule starts exactly from the state the previous rule concluded (food reaches the stomach → reaches the small intestine → nutrients pass into the blood).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches nutrients pass into the blood after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “the mouth breaks up food”; we apply the rule that starts exactly from this state and deduce “food reaches the stomach”.
2. We have “food reaches the stomach”; we apply the rule that starts exactly from this state and deduce “reaches the small intestine”.
3. We have “reaches the small intestine”; we apply the rule that starts exactly from this state and deduce “nutrients pass into the blood”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: the mouth breaks up food → food reaches the stomach → reaches the small intestine → nutrients pass into the blood.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
