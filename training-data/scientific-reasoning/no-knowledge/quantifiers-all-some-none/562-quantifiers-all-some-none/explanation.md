# Explanation 562 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all has an air cavity cases in the has a large volume category, some case in both, no case in both has a large volume and has low mass for its volume, and some has low mass for its volume case outside has an air cavity.
2. Statement 1 is false: the object A carries has an air cavity without has a large volume.
3. Statement 2 is true: the object B carries both properties.
4. Statement 3 is false: the object D is in both categories, and statement 4 is true: the object D is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample the object A.
3. Statement 2 is true: witness the object B.
4. Statements 3 and 4 are, respectively: false — the object D is in both categories; true — witness the object D.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
