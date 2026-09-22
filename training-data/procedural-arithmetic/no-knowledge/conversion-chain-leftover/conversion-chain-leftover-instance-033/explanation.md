# Explanation conversion-chain-leftover-33 — Conversion Chain Leftover

## Explanation

1. The statement hands 1081 parts to a line whose crates hold 46 parts and whose boxes hold 8 parts.
2. The crates stage removes one crate at a time and publishes 23 full crates with 23 parts beyond them.
3. The boxes stage packs those parts one box at a time: 2 boxes, with 7 parts left over.

**Generator provenance.** arithmetic.mjs 1.3.0, family conversion-chain-leftover, instance 33, sampled with seed 20260921 from the latent plan `conversion-chain-leftover`; this example carries no source span because its statement was generated.

## Result

**Answer.** 1081 parts fill 23 crates and 2 boxes, with 7 parts left over.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
