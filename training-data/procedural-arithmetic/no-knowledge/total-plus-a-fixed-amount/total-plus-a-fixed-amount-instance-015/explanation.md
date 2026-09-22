# Explanation total-plus-a-fixed-amount-15 — Total Plus A Fixed Amount

## Explanation

1. The four days consumed 13 + 16 + 11 + 10 sheets, which is 50 sheets.
2. The extra stock is the fixed 10 sheets.
3. Ordering both is 60 sheets.

**Generator provenance.** arithmetic.mjs 1.2.0, family total-plus-a-fixed-amount, instance 15, sampled with seed 20260921 from the latent plan `total-plus-a-fixed-amount`; this example carries no source span because its statement was generated.

## Result

**Answer.** 60 sheets must be ordered, which is 50 consumed plus 10 extra.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
