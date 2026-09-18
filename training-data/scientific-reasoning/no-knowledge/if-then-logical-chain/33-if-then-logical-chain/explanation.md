# Explanation 33 — If-then logical chain

## Explanation

1. The completed premise is “air enters the lungs”, so the deduction begins at that state.
2. The rule that starts from air enters the lungs concludes oxygen passes into the blood, and each later rule starts exactly from the state the previous rule concluded (oxygen passes into the blood → the blood transports oxygen → oxygen reaches the cells).
3. No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.
4. The deduction reaches oxygen reaches the cells after 3 steps, and no rule of the case is left unapplied.

Reference solution as printed in the source (form 3, 4 steps):

1. We have “air enters the lungs”; we apply the rule that starts exactly from this state and deduce “oxygen passes into the blood”.
2. We have “oxygen passes into the blood”; we apply the rule that starts exactly from this state and deduce “the blood transports oxygen”.
3. We have “the blood transports oxygen”; we apply the rule that starts exactly from this state and deduce “oxygen reaches the cells”.
4. Each rule is connected to the preceding one: the result of one step is the premise of the next step. We have not joined independent rules.

## Result

**Answer.** The deduced chain is: air enters the lungs → oxygen passes into the blood → the blood transports oxygen → oxygen reaches the cells.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
