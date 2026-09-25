# Explanation minimal-winning-coalition-2 — Minimal Winning Coalition

## Explanation

1. The council seats are A=7, B=5, C=2, and a winning coalition must reach 7 seats.
2. Every non-empty subset is tested: the winning ones reach the threshold, and the minimal ones would fall below it again if any single member left.
3. The minimal winning coalitions are A (7 seats), BC (7 seats).

**Generator provenance.** arithmetic.mjs 1.3.0, family minimal-winning-coalition, instance 2, sampled with seed 20260921 from the latent plan `minimal-winning-coalition`; this example carries no source span because its statement was generated.

## Result

**Answer.** A with 7 seats; BC with 7 seats.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
