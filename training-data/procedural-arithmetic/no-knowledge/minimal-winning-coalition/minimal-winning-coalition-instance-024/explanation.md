# Explanation minimal-winning-coalition-24 — Minimal Winning Coalition

## Explanation

1. The council seats are A=8, B=5, C=3, and a winning coalition must reach 6 seats.
2. Every non-empty subset is tested: the winning ones reach the threshold, and the minimal ones would fall below it again if any single member left.
3. The minimal winning coalitions are A (8 seats), BC (8 seats).

**Generator provenance.** arithmetic.mjs 1.3.0, family minimal-winning-coalition, instance 24, sampled with seed 20260921 from the latent plan `minimal-winning-coalition`; this example carries no source span because its statement was generated.

## Result

**Answer.** A with 8 seats; BC with 8 seats.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
