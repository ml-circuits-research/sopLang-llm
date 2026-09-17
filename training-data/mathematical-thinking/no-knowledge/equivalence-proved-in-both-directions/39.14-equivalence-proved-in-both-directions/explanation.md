# Explanation 39.14 — Equivalence proved in both directions

## Explanation

1. An "if and only if" needs both implications: even implies membership, and membership implies even.
2. Testing those implications on every element of the domain confirms that both hold throughout the domain.

Reference solution as printed in the source (chapter 39, 4 steps):

1. First direction: verify that every even number in the domain is 2 or 4.
2. Second direction: verify that 2 and 4 are even.
3. Both are true by the definition of parity.
4. Only together do they establish equivalence.

## Result

**Answer.** Both directions must be checked; both are true.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
