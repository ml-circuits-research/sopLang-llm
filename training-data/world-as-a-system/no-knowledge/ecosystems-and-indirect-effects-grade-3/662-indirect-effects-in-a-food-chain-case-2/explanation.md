# Explanation 662 — Indirect effects in a food chain: case 2

## Explanation

1. small fish is a food source, so the stated rule lets its consumer large fish decrease directly.
2. The chain continues from large fish, so heron is affected indirectly rather than directly.
3. The food of the named population lies upstream of the change, so the stated rule does not imply that it decreases for the same reason.
4. The rule gives a directional possibility only; it carries no population numbers.

Reference solution as printed in the source (family N8, 3 steps):

1. large fish depends directly on small fish, so it may decrease.
2. heron depends on large fish, so it may also be indirectly affected.
3. algae is food for small fish; the stated rule does not imply it decreases for the same reason. Cross-domain check: compare 11 with 7; 11≥7 is true.

## Result

**Answer.** large fish may decrease directly and heron may be affected indirectly. Cross-domain answer: quorum is met.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
