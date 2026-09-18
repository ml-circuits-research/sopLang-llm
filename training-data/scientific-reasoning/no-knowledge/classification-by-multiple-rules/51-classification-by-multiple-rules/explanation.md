# Explanation 51 — Classification by multiple rules

## Explanation

1. The rule turns into a conjunction: all 3 required properties must be YES and every forbidden property must be NO (is greater than the mesh of the sieve).
2. Checking the cases against the stated values eliminates each one as soon as a single required property is NO or a forbidden property is YES.
3. Only Case iron satisfies every clause of the rule.

Reference solution as printed in the source (form 1, 4 steps):

1. We write the requirements as a conjunction: all 3 conditions must be true simultaneously.
2. We check the cases one by one using only the given table. Case iron has the required values for all required conditions.
3. Any other case is eliminated as soon as we find at least one mandatory requirement with the value NO.
4. Only one case remains compatible with the full rule: iron.

## Result

**Answer.** Case iron.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
