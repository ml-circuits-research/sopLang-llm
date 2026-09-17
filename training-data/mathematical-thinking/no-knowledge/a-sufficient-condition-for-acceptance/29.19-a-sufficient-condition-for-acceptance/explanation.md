# Explanation 29.19 — A sufficient condition for acceptance

## Explanation

1. Acceptance is the disjunction red OR star, so either property on its own is enough.
2. red therefore implies acceptance, which makes it sufficient.
3. But star alone is also accepted without red, so red is not required and is not necessary.

Reference solution as printed in the source (chapter 29, 4 steps):

1. If it is red, the first branch of “or” is true, so acceptance is guaranteed.
2. But there are objects with a star that are not red and are still accepted.
3. Therefore red is sufficient.
4. It is not necessary.

## Result

**Answer.** It is sufficient, but not necessary.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
