# Explanation 816 — Resolving conflicting sources: case 1

## Explanation

1. Sources A, B, C are stated, and A and C are the two that are close to the event and independent.
2. Those two report 40 and 42, a cluster of nearby counts, while the remaining account reports 90.
3. The late or derivative account has no independent chain of transmission, so agreement between two proximate independent sources outweighs it.
4. The evidence therefore supports an arrival count near 40–42 rather than 90.

Reference solution as printed in the source (family H4, 4 steps):

1. A is contemporary and reports 40.
2. C is an independent operational record and reports 42, close to A.
3. B is much later and has an unknown chain of transmission.
4. The cluster near 40–42 is therefore better supported than 90. Cross-domain check: 6×3=18 km.

## Result

**Answer.** An arrival count near 40–42 carts is better supported than 90. Cross-domain answer: 18 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
