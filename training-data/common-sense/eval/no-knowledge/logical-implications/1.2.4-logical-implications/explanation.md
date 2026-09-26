# Explanation 1.2.4 — Logical implications

## Explanation

1. The observed case fixes A active and C inactive, and only the stated conditionals are chained forward from those facts.
2. rule 1 gives B active; rule 2 gives D active; rule 3 gives E inactive, so the values that follow necessarily are B active, D active, E inactive.
3. A conditional licenses its consequent only when its condition holds, so none of the derived values can be reversed into a statement about the other indicators.
4. Rule 4 would need E active, which the derived facts do not satisfy, so it is compatible with these conclusions but is not needed for them.

Reference solution as printed in the source (template 7, 4 steps):

1. From A active and Rule 1, infer B active.
2. From B active, C inactive, and Rule 2, infer D active.
3. From D active and Rule 3, infer E inactive.
4. Rule 4 says only that E active would imply A inactive. E is already known to be inactive from Rule 3, so Rule 4 is not used in the deductive chain.

## Result

**Answer.** B must be active; D must be active; E must be inactive. Rule 4 is not needed for these three conclusions in this case.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
