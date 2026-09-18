# Explanation 68 — If-then logical chain

## Explanation

1. The completed premise is “the source emits light”, so the deduction begins at that state.
2. The rule that starts from the source emits light concludes light reaches the object, and each later rule starts exactly from the state the previous rule concluded (light reaches the object → the opaque object blocks part of the light → a shadowed area appears on the screen).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches a shadowed area appears on the screen after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “the source emits light”; we apply the rule that starts exactly from this state and deduce “light reaches the object”.
2. We have “light reaches the object”; we apply the rule that starts exactly from this state and deduce “the opaque object blocks part of the light”.
3. We have “the opaque object blocks part of the light”; we apply the rule that starts exactly from this state and deduce “a shadowed area appears on the screen”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: the source emits light → light reaches the object → the opaque object blocks part of the light → a shadowed area appears on the screen.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
