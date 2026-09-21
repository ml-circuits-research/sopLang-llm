# Explanation crate-count-with-partial-last-2 — Crate Count with Partial Last

## Explanation

1. The shift produces 58 units and a crate holds 6.
2. Filling whole crates leaves a partial one, so the count is the smallest number of crates that holds the shift: 10.
3. The last crate carries the remainder: 4 units.

**Generator provenance.** arithmetic.mjs 1.1.0, family crate-count-with-partial-last, instance 2, sampled with seed 20260921 from the latent plan `crate-count-with-partial-last`; this example carries no source span because its statement was generated.

## Result

**Answer.** 10 crates are needed, and the last crate holds 4 units.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
