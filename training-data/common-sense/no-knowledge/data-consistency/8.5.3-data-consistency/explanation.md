# Explanation 8.5.3 — Data consistency

## Explanation

1. The three categories are disjoint and together cover every unit, so the partition rule forces the total to be 210 + 190 + 140 = 540 documents.
2. The page prints 520 documents, so printed minus calculated is -20 documents; two numbers that must agree do not, so the table is not internally consistent.
3. The secondary relationship is satisfied (400 > 140), so the total is the relationship the report breaks.
4. Nothing in the statement fixes A, B, or C independently of the total, so the mismatch proves that some entry is wrong but cannot say which one, and any single category, the total, or a combination could carry the error.

Reference solution as printed in the source (template 9, 4 steps):

1. The partition rule requires total = 210+190+140 = 540 documents.
2. Printed total = 520; printed − calculated = -20 documents.
3. The secondary rule A+B>C gives 400>140, so it is satisfied.
4. Without an independent source for A, B, C, or the total, we can show that the set is inconsistent but cannot determine uniquely which entry is wrong.

## Result

**Answer.** No. The category sum is 540, while the printed total differs by -20 documents. The inconsistency is demonstrable, but the incorrect cell cannot be identified uniquely from these data alone.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
