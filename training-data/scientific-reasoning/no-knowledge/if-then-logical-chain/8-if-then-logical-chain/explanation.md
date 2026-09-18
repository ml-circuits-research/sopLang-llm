# Explanation 8 — If-then logical chain

## Explanation

1. The completed premise is “water enters the root”, so the deduction begins at that state.
2. The rule that starts from water enters the root concludes water moves up through the stem, and each later rule starts exactly from the state the previous rule concluded (water moves up through the stem → water reaches the leaf → the leaf uses water and light).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches the leaf uses water and light after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “water enters the root”; we apply the rule that starts exactly from this state and deduce “water moves up through the stem”.
2. We have “water moves up through the stem”; we apply the rule that starts exactly from this state and deduce “water reaches the leaf”.
3. We have “water reaches the leaf”; we apply the rule that starts exactly from this state and deduce “the leaf uses water and light”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: water enters the root → water moves up through the stem → water reaches the leaf → the leaf uses water and light.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
