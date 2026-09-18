# Explanation 6.2.8 — Weighted averages

## Explanation

1. Every case must carry the same weight, so each group contributes its mean multiplied by its case count: Group A contributes 50 × 76 = 3800 points and Group B contributes 65 × 94 = 6110 points.
2. The combined total is 9910 points across 115 cases, so the weighted mean is 86.17.
3. The preliminary summary weights the two groups equally, (76 + 94) / 2 = 85, which is correct only when the groups contain the same number of cases.
4. Averaging the group means would over-represent the smaller group, so the weighted mean is the method that satisfies the equal-weight rule.

Reference solution as printed in the source (template 1, 3 steps):

1. Group A contributes 50 × 76 = 3800 total points; Group B contributes 65 × 94 = 6110.
2. The combined total is 9910 across 115 cases, so the combined mean is 86.17.
3. The simple mean (76 + 94) / 2 = 85 would give each group half the weight even though the groups contain different numbers of cases.

## Result

**Answer.** The weighted mean is 86.17, compared with a simple mean-of-means of 85.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
