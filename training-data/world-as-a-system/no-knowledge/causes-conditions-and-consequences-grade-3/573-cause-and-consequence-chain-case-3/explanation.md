# Explanation 573 — Cause-and-consequence chain: case 3

## Explanation

1. Read the given facts as true predicates and fire each rule only when its antecedent is satisfied: AND needs every listed condition, OR needs one.
2. Forward chaining adds road closure, a warning in that order, and no converse of a rule is used.
3. Flooding is stated as a fact, so the answer reports it as given rather than deduced.

Reference solution as printed in the source (family H5, 3 steps):

1. Flooding is stated directly, so apply the flooding→road-closure rule.
2. Apply siren→warning.
3. Do not use flooding to infer rain or a high river; that would reverse a rule. Cross-domain check: 12+2=14, so the team finishes at 14:00.

## Result

**Answer.** Road closure and a warning can be deduced; flooding is already given as a fact. Cross-domain answer: 14:00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
