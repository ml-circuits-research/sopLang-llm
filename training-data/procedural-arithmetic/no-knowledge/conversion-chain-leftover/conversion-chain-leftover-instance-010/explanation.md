# Explanation conversion-chain-leftover-10 — Conversion Chain Leftover

## Explanation

1. The statement hands 412 parts to a line whose crates hold 35 parts and whose boxes hold 7 parts.
2. The crates stage removes one crate at a time and publishes 11 full crates with 27 parts beyond them.
3. The boxes stage packs those parts one box at a time: 3 boxes, with 6 parts left over.

**Generator provenance.** arithmetic.mjs 1.1.0, family conversion-chain-leftover, instance 10, sampled with seed 20260921 from the latent plan `conversion-chain-leftover`; this example carries no source span because its statement was generated.

## Result

**Answer.** 412 parts fill 11 crates and 3 boxes, with 6 parts left over.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
