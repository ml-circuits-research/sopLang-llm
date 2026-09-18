# Explanation 798 — Discovering a rule from examples

## Explanation

1. The statement names A as "there is a fulcrum" and B as "effort is applied on the correct side", and shows 3 input/output rows of the unknown rule.
2. Each candidate rule is turned into a prediction for those rows, and a candidate is eliminated as soon as one prediction disagrees with the observed output.
3. The only candidate that reproduces all 3 rows is the one that says at least one of A and B must be YES.
4. Applying that rule to the new case A=YES, B=NO gives the result YES, and the rule was chosen because it fits every example at once, not because its wording sounds related to the world of the problem.

Reference solution as printed in the source (form 33, 4 steps):

1. For each candidate rule, we construct predictions for the three given examples.
2. The only rule that reproduces all three outputs is “A or B (at least one)”.
3. We apply the same rule to YES/NO and we obtain YES.
4. The rule was chosen because it fits all the data simultaneously, not because of verbal similarity.

## Result

**Answer.** Rule is A or B (at least one); for A=YES, B=NO the result is YES.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
