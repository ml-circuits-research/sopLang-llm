# Explanation 73 — If-then logical chain

## Explanation

1. The completed premise is “the source vibrates”, so the deduction begins at that state.
2. The rule that starts from the source vibrates concludes the vibration sets the medium in motion, and each later rule starts exactly from the state the previous rule concluded (the vibration sets the medium in motion → the signal propagates → the receiver detects the sound).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the receiver detects the sound after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “the source vibrates”; we apply the rule that starts exactly from this state and deduce “the vibration sets the medium in motion”.
2. We have “the vibration sets the medium in motion”; we apply the rule that starts exactly from this state and deduce “the signal propagates”.
3. We have “the signal propagates”; we apply the rule that starts exactly from this state and deduce “the receiver detects the sound”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: the source vibrates → the vibration sets the medium in motion → the signal propagates → the receiver detects the sound.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
