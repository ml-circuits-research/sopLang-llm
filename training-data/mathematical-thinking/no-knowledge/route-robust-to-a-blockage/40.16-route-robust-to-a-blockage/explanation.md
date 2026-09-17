# Explanation 40.16 — Route robust to a blockage

## Explanation

1. Blocking one link destroys a structure whose routes share that link, so robustness against a single blockage requires more than one separate route.
2. The first network offers a single route, while the second offers two separate routes, so one blocked link still leaves a path in the second.
3. The more robust structure is Network 2.

Reference solution as printed in the source (chapter 40, 4 steps):

1. In Network 1, blocking S-A or A-T destroys the only route.
2. In Network 2, blocking an edge on the route through B leaves the route through C, and vice versa, provided the routes share no edges.
3. The normal cost is higher, but redundancy provides continuity.
4. By the robustness criterion, Network 2 is better.

## Result

**Answer.** Network 2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
