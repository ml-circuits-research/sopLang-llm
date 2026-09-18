# Explanation 522 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all migrates cases in the stores food category, some case in both, no case in both stores food and has a protected shelter, and some has a protected shelter case outside migrates.
2. Statement 1 is false: the animal B carries migrates without stores food.
3. Statement 2 is true: the animal A carries both properties.
4. Statement 3 is false: the animal A is in both categories, and statement 4 is true: the animal E is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample the animal B.
3. Statement 2 is true: witness the animal A.
4. Statements 3 and 4 are, respectively: false — the animal A is in both categories; true — witness the animal E.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
