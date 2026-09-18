# Explanation 517 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all drains quickly cases in the contains humus category, some case in both, no case in both contains humus and retains air-filled pores, and some retains air-filled pores case outside drains quickly.
2. Statement 1 is false: the sample C carries drains quickly without contains humus.
3. Statement 2 is true: the sample B carries both properties.
4. Statement 3 is false: the sample D is in both categories, and statement 4 is true: the sample A is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample the sample C.
3. Statement 2 is true: witness the sample B.
4. Statements 3 and 4 are, respectively: false — the sample D is in both categories; true — witness the sample A.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
