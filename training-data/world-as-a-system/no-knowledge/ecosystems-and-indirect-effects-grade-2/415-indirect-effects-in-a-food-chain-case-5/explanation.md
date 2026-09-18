# Explanation 415 — Indirect effects in a food chain: case 5

## Explanation

1. rabbit is a food source, so the stated rule lets its consumer fox decrease directly.
2. The chain continues from fox, so eagle is affected indirectly rather than directly.
3. The food of the named population lies upstream of the change, so the stated rule does not imply that it decreases for the same reason.
4. The rule gives a directional possibility only; it carries no population numbers.

Reference solution as printed in the source (family N8, 3 steps):

1. fox depends directly on rabbit, so it may decrease.
2. eagle depends on fox, so it may also be indirectly affected.
3. grass is food for rabbit; the stated rule does not imply it decreases for the same reason. Cross-domain check: 11−4=7 independent reports remain.

## Result

**Answer.** fox may decrease directly and eagle may be affected indirectly. Cross-domain answer: 7 independent reports.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
