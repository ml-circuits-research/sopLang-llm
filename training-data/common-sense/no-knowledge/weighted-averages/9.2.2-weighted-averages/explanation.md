# Explanation 9.2.2 — Weighted averages

## Explanation

1. Every case must carry the same weight, so each group contributes its mean multiplied by its case count: Group A contributes 25 × 60 = 1500 points and Group B contributes 55 × 80 = 4400 points.
2. The combined total is 5900 points across 80 cases, so the weighted mean is 73.75.
3. The preliminary summary weights the two groups equally, (60 + 80) / 2 = 70, which is correct only when the groups contain the same number of cases.
4. Averaging the group means would over-represent the smaller group, so the weighted mean is the method that satisfies the equal-weight rule.

Reference solution as printed in the source (template 1, 3 steps):

1. Group A contributes 25 × 60 = 1500 total points; Group B contributes 55 × 80 = 4400.
2. The combined total is 5900 across 80 cases, so the combined mean is 73.75.
3. The simple mean (60 + 80) / 2 = 70 would give each group half the weight even though the groups contain different numbers of cases.

## Result

**Answer.** The weighted mean is 73.75, compared with a simple mean-of-means of 70.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
