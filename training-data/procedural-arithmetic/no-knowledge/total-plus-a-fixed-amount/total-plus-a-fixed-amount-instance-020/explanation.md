# Explanation total-plus-a-fixed-amount-20 — Total Plus A Fixed Amount

## Explanation

1. The four days consumed 16 + 32 + 8 + 28 sheets, which is 84 sheets.
2. The extra stock is the fixed 25 sheets.
3. Ordering both is 109 sheets.

**Generator provenance.** arithmetic.mjs 1.3.0, family total-plus-a-fixed-amount, instance 20, sampled with seed 20260921 from the latent plan `total-plus-a-fixed-amount`; this example carries no source span because its statement was generated.

## Result

**Answer.** 109 sheets must be ordered, which is 84 consumed plus 25 extra.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
