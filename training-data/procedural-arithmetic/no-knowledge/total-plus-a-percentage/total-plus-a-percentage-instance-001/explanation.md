# Explanation total-plus-a-percentage-1 — Total Plus A Percentage

## Explanation

1. The four days consumed 33 + 28 + 26 + 17 sheets, which is 104 sheets.
2. 25 percent of 104 sheets is 26 sheets, and that is the extra stock.
3. Ordering both is 130 sheets.

**Generator provenance.** arithmetic.mjs 1.3.0, family total-plus-a-percentage, instance 1, sampled with seed 20260921 from the latent plan `total-plus-a-percentage`; this example carries no source span because its statement was generated.

## Result

**Answer.** 130 sheets must be ordered, which is 104 consumed plus 26 extra.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
