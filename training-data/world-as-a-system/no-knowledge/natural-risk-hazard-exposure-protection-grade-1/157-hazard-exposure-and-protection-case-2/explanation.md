# Explanation 157 — Hazard, exposure, and protection: case 2

## Explanation

1. The stated model gives each site a risk index of hazard × exposure ÷ protection, so the three values are computed independently.
2. The indices in printed order are A=12.00, B=6.00, C=12.00.
3. The smallest of those indices belongs to Site B, which is therefore the lowest-risk site.
4. A larger hazard value alone does not decide the answer; the exposure and protection values are divided into the product as well.

Reference solution as printed in the source (family N7, 3 steps):

1. Compute hazard×exposure÷protection for each site.
2. Results: A=12.00, B=6.00, C=12.00.
3. The lowest value is Site B.

## Result

**Answer.** A=12.00; B=6.00; C=12.00. Lowest: Site B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
