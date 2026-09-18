# Explanation 567 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all keeps air trapped cases in the can change its volume category, some case in both, no case in both can change its volume and has an opening, and some has an opening case outside keeps air trapped.
2. Statement 1 is false: the container C carries keeps air trapped without can change its volume.
3. Statement 2 is true: the balloon B carries both properties.
4. Statement 3 is false: the tube D is in both categories, and statement 4 is true: syringe A is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample the container C.
3. Statement 2 is true: witness the balloon B.
4. Statements 3 and 4 are, respectively: false — the tube D is in both categories; true — witness syringe A.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
