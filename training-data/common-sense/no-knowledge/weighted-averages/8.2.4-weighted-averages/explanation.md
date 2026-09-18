# Explanation 8.2.4 — Weighted averages

## Explanation

1. Every case must carry the same weight, so each group contributes its mean multiplied by its case count: Group A contributes 35 × 74 = 2590 points and Group B contributes 50 × 72 = 3600 points.
2. The combined total is 6190 points across 85 cases, so the weighted mean is 72.82.
3. The preliminary summary weights the two groups equally, (74 + 72) / 2 = 73, which is correct only when the groups contain the same number of cases.
4. Averaging the group means would over-represent the smaller group, so the weighted mean is the method that satisfies the equal-weight rule.

Reference solution as printed in the source (template 1, 3 steps):

1. Group A contributes 35 × 74 = 2590 total points; Group B contributes 50 × 72 = 3600.
2. The combined total is 6190 across 85 cases, so the combined mean is 72.82.
3. The simple mean (74 + 72) / 2 = 73 would give each group half the weight even though the groups contain different numbers of cases.

## Result

**Answer.** The weighted mean is 72.82, compared with a simple mean-of-means of 73.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
