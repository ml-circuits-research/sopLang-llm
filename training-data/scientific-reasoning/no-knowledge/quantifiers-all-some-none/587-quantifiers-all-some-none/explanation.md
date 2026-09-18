# Explanation 587 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all is conductor cases in the is insulated on the outside category, some case in both, no case in both is insulated on the outside and can close the path, and some can close the path case outside is conductor.
2. Statement 1 is false: the wire A carries is conductor without is insulated on the outside.
3. Statement 2 is true: the clamp B carries both properties.
4. Statement 3 is false: the switch D is in both categories, and statement 4 is true: the switch D is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample the wire A.
3. Statement 2 is true: witness the clamp B.
4. Statements 3 and 4 are, respectively: false — the switch D is in both categories; true — witness the switch D.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
