# Explanation 261 — Following water from North Fork

## Explanation

1. Each "flows into" fact is a directed arrow, so the network has 3 arrows from upstream to downstream.
2. Following the arrows from North Fork reaches Clearwater.
3. No fact removes an edge from the network.

Reference solution as printed in the source (family G3, 3 steps):

1. Rewrite the facts as arrows: North Fork→Willow Stream, Blue Creek→Willow Stream, Willow Stream→Clearwater.
2. Follow arrows starting from North Fork.
3. An arrow path reaches Clearwater, so North Fork is upstream of Clearwater.

## Result

**Answer.** Yes; water from North Fork can reach Clearwater.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
