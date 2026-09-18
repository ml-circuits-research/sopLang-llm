# Explanation 48 — If-then logical chain

## Explanation

1. The completed premise is “we establish the requirements”, so the deduction begins at that state.
2. The rule that starts from we establish the requirements concludes we test the properties, and each later rule starts exactly from the state the previous rule concluded (we test the properties → we eliminate the materials unsuitable → we choose the material which meets all the requirements).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches we choose the material which meets all the requirements after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “we establish the requirements”; we apply the rule that starts exactly from this state and deduce “we test the properties”.
2. We have “we test the properties”; we apply the rule that starts exactly from this state and deduce “we eliminate the materials unsuitable”.
3. We have “we eliminate the materials unsuitable”; we apply the rule that starts exactly from this state and deduce “we choose the material which meets all the requirements”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: we establish the requirements → we test the properties → we eliminate the materials unsuitable → we choose the material which meets all the requirements.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
