# Explanation conversion-chain-leftover-39 — Conversion Chain Leftover

## Explanation

1. The statement hands 1217 parts to a line whose crates hold 48 parts and whose boxes hold 3 parts.
2. The crates stage removes one crate at a time and publishes 25 full crates with 17 parts beyond them.
3. The boxes stage packs those parts one box at a time: 5 boxes, with 2 parts left over.

**Generator provenance.** arithmetic.mjs 1.3.0, family conversion-chain-leftover, instance 39, sampled with seed 20260921 from the latent plan `conversion-chain-leftover`; this example carries no source span because its statement was generated.

## Result

**Answer.** 1217 parts fill 25 crates and 5 boxes, with 2 parts left over.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
