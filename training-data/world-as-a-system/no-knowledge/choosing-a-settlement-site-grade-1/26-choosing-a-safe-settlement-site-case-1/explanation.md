# Explanation 26 — Choosing a safe settlement site: case 1

## Explanation

1. The mandatory conditions are water, road access, a location outside the flood zone, so a site that fails any of them is disqualified before the preference is read.
2. Filtering the 4 candidate sites leaves 1 valid site(s), and the highest farmland score among them is 2, on Site A.
3. The preference is applied only to the valid sites, so a disqualified site with a higher score cannot win.

Reference solution as printed in the source (family G6, 4 steps):

1. Separate mandatory conditions from the preference.
2. Filtering by water, road, and flood safety leaves ['Site A'].
3. Compare only the farmland scores of feasible sites: Site A=2.
4. Site A has the best score among valid sites.

## Result

**Answer.** Site A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
