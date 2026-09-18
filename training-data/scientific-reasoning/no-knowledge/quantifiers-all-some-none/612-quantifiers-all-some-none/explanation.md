# Explanation 612 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all has good insulation cases in the uses natural light category, some case in both, no case in both uses natural light and switches off unnecessary loads, and some switches off unnecessary loads case outside has good insulation.
2. Statement 1 is false: room A carries has good insulation without uses natural light.
3. Statement 2 is true: room B carries both properties.
4. Statement 3 is false: room D is in both categories, and statement 4 is true: room D is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample room A.
3. Statement 2 is true: witness room B.
4. Statements 3 and 4 are, respectively: false — room D is in both categories; true — witness room D.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
