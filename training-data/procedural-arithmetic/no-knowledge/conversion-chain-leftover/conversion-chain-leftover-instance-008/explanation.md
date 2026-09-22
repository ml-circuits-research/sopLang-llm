# Explanation conversion-chain-leftover-8 — Conversion Chain Leftover

## Explanation

1. The statement hands 759 parts to a line whose crates hold 56 parts and whose boxes hold 5 parts.
2. The crates stage removes one crate at a time and publishes 13 full crates with 31 parts beyond them.
3. The boxes stage packs those parts one box at a time: 6 boxes, with 1 parts left over.

**Generator provenance.** arithmetic.mjs 1.3.0, family conversion-chain-leftover, instance 8, sampled with seed 20260921 from the latent plan `conversion-chain-leftover`; this example carries no source span because its statement was generated.

## Result

**Answer.** 759 parts fill 13 crates and 6 boxes, with 1 parts left over.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
