# Explanation 582 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all is hard cases in the is porous category, some case in both, no case in both is porous and absorbs a lot in the model, and some absorbs a lot in the model case outside is hard.
2. Statement 1 is false: the wall A carries is hard without is porous.
3. Statement 2 is true: the panel C carries both properties.
4. Statement 3 is false: the floor D is in both categories, and statement 4 is true: the floor D is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample the wall A.
3. Statement 2 is true: witness the panel C.
4. Statements 3 and 4 are, respectively: false — the floor D is in both categories; true — witness the floor D.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
