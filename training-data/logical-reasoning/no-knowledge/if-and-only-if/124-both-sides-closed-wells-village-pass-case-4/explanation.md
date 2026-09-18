# Explanation 124 — Both sides closed — Wells Village pass — case 4

## Explanation

1. The office in Wells Village issues a day pass if and only if the fee of 8 is paid today and a photograph is on file, so the two halves are together necessary and sufficient.
2. Harun paid today but has no photograph, so one half of the pair is missing and the pass is blocked.
3. Iona has a photograph but did not pay today, so the other half is missing and the pass is blocked just the same.
4. Ruth holds both halves, and the sufficiency direction of "if and only if" issues the pass to Ruth.

Reference solution as printed in the source (section 13, 5 steps):

1. Biconditional: both directions.
2. Pay-without-photo fails one half.
3. Photo-without-pay fails the other.
4. Both halves present: the pass is issued.
5. Do not treat “and” as “or.”

## Result

**Answer.** Only Ruth. “If and only if” makes the pair necessary and sufficient. Missing either half blocks the pass.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
