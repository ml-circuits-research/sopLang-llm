# Explanation 577 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all reflects toward right cases in the is diagonally oriented category, some case in both, no case in both is diagonally oriented and is on the route, and some is on the route case outside reflects toward right.
2. Statement 1 is false: mirror B carries reflects toward right without is diagonally oriented.
3. Statement 2 is true: mirror A carries both properties.
4. Statement 3 is false: the screen C is in both categories, and statement 4 is true: the screen C is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample mirror B.
3. Statement 2 is true: witness mirror A.
4. Statements 3 and 4 are, respectively: false — the screen C is in both categories; true — witness the screen C.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
