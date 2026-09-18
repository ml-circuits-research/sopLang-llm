# Explanation 5.10.6 — Weighted averages

## Explanation

1. Every case must carry the same weight, so each group contributes its mean multiplied by its case count: Group A contributes 55 × 70 = 3850 points and Group B contributes 70 × 82 = 5740 points.
2. The combined total is 9590 points across 125 cases, so the weighted mean is 76.72.
3. The preliminary summary weights the two groups equally, (70 + 82) / 2 = 76, which is correct only when the groups contain the same number of cases.
4. Averaging the group means would over-represent the smaller group, so the weighted mean is the method that satisfies the equal-weight rule.

Reference solution as printed in the source (template 1, 3 steps):

1. Group A contributes 55 × 70 = 3850 total points; Group B contributes 70 × 82 = 5740.
2. The combined total is 9590 across 125 cases, so the combined mean is 76.72.
3. The simple mean (70 + 82) / 2 = 76 would give each group half the weight even though the groups contain different numbers of cases.

## Result

**Answer.** The weighted mean is 76.72, compared with a simple mean-of-means of 76.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
