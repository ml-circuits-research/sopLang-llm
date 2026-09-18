# Explanation 502 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all carries pollen cases in the touches the stigma category, some case in both, no case in both touches the stigma and visits in the morning, and some visits in the morning case outside carries pollen.
2. Statement 1 is false: the bumblebee B carries carries pollen without touches the stigma.
3. Statement 2 is true: the bee A carries both properties.
4. Statement 3 is false: the butterfly C is in both categories, and statement 4 is true: the butterfly C is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample: the bumblebee B.
3. Statement 2 is true: witness: the bee A.
4. Statements 3 and 4 are, respectively: false — the butterfly C is in both categories; true — witness: the butterfly C.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
