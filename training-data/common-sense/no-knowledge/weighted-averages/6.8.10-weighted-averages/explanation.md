# Explanation 6.8.10 — Weighted averages

## Explanation

1. Every case must carry the same weight, so each group contributes its mean multiplied by its case count: Group A contributes 55 × 80 = 4400 points and Group B contributes 75 × 74 = 5550 points.
2. The combined total is 9950 points across 130 cases, so the weighted mean is 76.54.
3. The preliminary summary weights the two groups equally, (80 + 74) / 2 = 77, which is correct only when the groups contain the same number of cases.
4. Averaging the group means would over-represent the smaller group, so the weighted mean is the method that satisfies the equal-weight rule.

Reference solution as printed in the source (template 1, 3 steps):

1. Group A contributes 55 × 80 = 4400 total points; Group B contributes 75 × 74 = 5550.
2. The combined total is 9950 across 130 cases, so the combined mean is 76.54.
3. The simple mean (80 + 74) / 2 = 77 would give each group half the weight even though the groups contain different numbers of cases.

## Result

**Answer.** The weighted mean is 76.54, compared with a simple mean-of-means of 77.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
