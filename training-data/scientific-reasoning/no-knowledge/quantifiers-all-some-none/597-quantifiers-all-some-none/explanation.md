# Explanation 597 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all shows the illuminated part cases in the is opposite the Sun category, some case in both, no case in both is opposite the Sun and is between Earth and Sun, and some is between Earth and Sun case outside shows the illuminated part.
2. Statement 1 is false: the position B carries shows the illuminated part without is opposite the Sun.
3. Statement 2 is true: the position A carries both properties.
4. Statement 3 is false: the position A is in both categories, and statement 4 is true: the observer E is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample the position B.
3. Statement 2 is true: witness the position A.
4. Statements 3 and 4 are, respectively: false — the position A is in both categories; true — witness the observer E.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
