# Explanation 6.3.5 — Weighted averages

## Explanation

1. Every case must carry the same weight, so each group contributes its mean multiplied by its case count: Group A contributes 35 × 64 = 2240 points and Group B contributes 50 × 74 = 3700 points.
2. The combined total is 5940 points across 85 cases, so the weighted mean is 69.88.
3. The preliminary summary weights the two groups equally, (64 + 74) / 2 = 69, which is correct only when the groups contain the same number of cases.
4. Averaging the group means would over-represent the smaller group, so the weighted mean is the method that satisfies the equal-weight rule.

Reference solution as printed in the source (template 1, 3 steps):

1. Group A contributes 35 × 64 = 2240 total points; Group B contributes 50 × 74 = 3700.
2. The combined total is 5940 across 85 cases, so the combined mean is 69.88.
3. The simple mean (64 + 74) / 2 = 69 would give each group half the weight even though the groups contain different numbers of cases.

## Result

**Answer.** The weighted mean is 69.88, compared with a simple mean-of-means of 69.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
