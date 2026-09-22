# Explanation conversion-chain-leftover-5 — Conversion Chain Leftover

## Explanation

1. The statement hands 525 parts to a line whose crates hold 42 parts and whose boxes hold 6 parts.
2. The crates stage removes one crate at a time and publishes 12 full crates with 21 parts beyond them.
3. The boxes stage packs those parts one box at a time: 3 boxes, with 3 parts left over.

**Generator provenance.** arithmetic.mjs 1.2.0, family conversion-chain-leftover, instance 5, sampled with seed 20260921 from the latent plan `conversion-chain-leftover`; this example carries no source span because its statement was generated.

## Result

**Answer.** 525 parts fill 12 crates and 3 boxes, with 3 parts left over.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
