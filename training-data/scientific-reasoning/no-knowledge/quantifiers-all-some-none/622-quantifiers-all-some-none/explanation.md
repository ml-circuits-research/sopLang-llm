# Explanation 622 — Quantifiers: all, some, none

## Explanation

1. Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all is clean cases in the keeps heat category, some case in both, no case in both keeps heat and allows the measurement of the temperature, and some allows the measurement of the temperature case outside is clean.
2. Statement 1 is false: the container B carries is clean without keeps heat.
3. Statement 2 is true: the container A carries both properties.
4. Statement 3 is false: the container A is in both categories, and statement 4 is true: the thermometer E is a witness.

Reference solution as printed in the source (form 22, 4 steps):

1. For “all” we look for counterexamples; for “some” we look for at least one witness; for “none” we check if the intersection is empty.
2. Statement 1 is false: counterexample the container B.
3. Statement 2 is true: witness the container A.
4. Statements 3 and 4 are, respectively: false — the container A is in both categories; true — witness the thermometer E.

## Result

**Answer.** In order: false, true, false, true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
