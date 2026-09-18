# Explanation 2.4.10 — Weighted averages

## Explanation

1. Every case must carry the same weight, so each group contributes its mean multiplied by its case count: Group A contributes 30 × 60 = 1800 points and Group B contributes 45 × 76 = 3420 points.
2. The combined total is 5220 points across 75 cases, so the weighted mean is 69.6.
3. The preliminary summary weights the two groups equally, (60 + 76) / 2 = 68, which is correct only when the groups contain the same number of cases.
4. Averaging the group means would over-represent the smaller group, so the weighted mean is the method that satisfies the equal-weight rule.

Reference solution as printed in the source (template 1, 3 steps):

1. Group A contributes 30 × 60 = 1800 total points; Group B contributes 45 × 76 = 3420.
2. The combined total is 5220 across 75 cases, so the combined mean is 69.6.
3. The simple mean (60 + 76) / 2 = 68 would give each group half the weight even though the groups contain different numbers of cases.

## Result

**Answer.** The weighted mean is 69.6, compared with a simple mean-of-means of 68.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
