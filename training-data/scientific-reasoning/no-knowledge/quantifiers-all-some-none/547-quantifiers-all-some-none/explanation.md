# Explanation 547 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all has a long effort arm cases in the has a fixed support category, some case in both, no case in both has a fixed support and changes the direction of the force, and some changes the direction of the force case outside has a long effort arm.
2. Statement 1 is false: lever B carries has a long effort arm without has a fixed support.
3. Statement 2 is true: lever A carries both properties.
4. Statement 3 is false: lever A is in both categories, and statement 4 is true: lever E is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample lever B.
3. Statement 2 is true: witness lever A.
4. Statements 3 and 4 are, respectively: false — lever A is in both categories; true — witness lever E.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
