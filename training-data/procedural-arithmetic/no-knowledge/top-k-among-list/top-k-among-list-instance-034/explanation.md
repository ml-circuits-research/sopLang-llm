# Explanation top-k-among-list-34 — Top K Among List

## Explanation

1. The statement fixes 7 values and asks for the leading 4 of them.
2. The ranked stage orders every value from the largest down, and the keptTop stage takes the leading count of that ranking.
3. The answer names those kept values and adds them to 335.

**Generator provenance.** arithmetic.mjs 1.2.0, family top-k-among-list, instance 34, sampled with seed 20260921 from the latent plan `top-k-among-list`; this example carries no source span because its statement was generated.

## Result

**Answer.** The 4 largest values are 95, 89, 78 and 73, and their total is 335.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
