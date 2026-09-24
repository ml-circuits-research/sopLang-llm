# Explanation route-bottleneck-capacity-37 — Route Bottleneck Capacity

## Explanation

1. The 3 links run in series, so the route can pass no more than its narrowest link.
2. The capacities are 12, 10, 12, and the smallest is 10.
3. The bottleneck capacity of the route is therefore 10 units, the minimum rather than the sum.

**Generator provenance.** arithmetic.mjs 1.3.0, family route-bottleneck-capacity, instance 37, sampled with seed 20260921 from the latent plan `route-bottleneck-capacity`; this example carries no source span because its statement was generated.

## Result

**Answer.** The bottleneck capacity of the route is 10 units.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
