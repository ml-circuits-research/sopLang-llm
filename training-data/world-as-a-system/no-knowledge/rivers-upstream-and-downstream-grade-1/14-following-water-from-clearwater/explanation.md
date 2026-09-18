# Explanation 14 — Following water from Clearwater

## Explanation

1. Each "flows into" fact is a directed arrow, so the network has 3 arrows from upstream to downstream.
2. Following the arrows from Clearwater reaches Willow Stream.
3. No fact removes an edge from the network.

Reference solution as printed in the source (family G3, 3 steps):

1. Rewrite the facts as arrows: North Fork→Clearwater, Meadow River→Clearwater, Clearwater→Willow Stream.
2. Follow arrows starting from Clearwater.
3. An arrow path reaches Willow Stream, so Clearwater is upstream of Willow Stream.

## Result

**Answer.** Yes; water from Clearwater can reach Willow Stream.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
