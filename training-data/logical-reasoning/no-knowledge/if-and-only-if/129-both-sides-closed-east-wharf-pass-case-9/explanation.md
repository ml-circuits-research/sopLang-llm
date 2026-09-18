# Explanation 129 — Both sides closed — East Wharf pass — case 9

## Explanation

1. The office in East Wharf issues a day pass if and only if the fee of 13 is paid today and a photograph is on file, so the two halves are together necessary and sufficient.
2. Omar paid today but has no photograph, so one half of the pair is missing and the pass is blocked.
3. Pia has a photograph but did not pay today, so the other half is missing and the pass is blocked just the same.
4. Rafi holds both halves, and the sufficiency direction of "if and only if" issues the pass to Rafi.

Reference solution as printed in the source (section 13, 5 steps):

1. Biconditional: both directions.
2. Pay-without-photo fails one half.
3. Photo-without-pay fails the other.
4. Both halves present: the pass is issued.
5. Do not treat “and” as “or.”

## Result

**Answer.** Only Rafi. “If and only if” makes the pair necessary and sufficient. Missing either half blocks the pass.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
