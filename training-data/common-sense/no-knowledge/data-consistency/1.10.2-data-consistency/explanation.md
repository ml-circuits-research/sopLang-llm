# Explanation 1.10.2 — Data consistency

## Explanation

1. The three categories are disjoint and together cover every unit, so the partition rule forces the total to be 240 + 110 + 80 = 430 cases.
2. The page prints 420 cases, so printed minus calculated is -10 cases; two numbers that must agree do not, so the table is not internally consistent.
3. The secondary relationship is satisfied (350 > 80), so the total is the relationship the report breaks.
4. Nothing in the statement fixes A, B, or C independently of the total, so the mismatch proves that some entry is wrong but cannot say which one, and any single category, the total, or a combination could carry the error.
5. The inconsistency is demonstrable, but the incorrect cell cannot be identified uniquely from these data alone.

Reference solution as printed in the source (template 9, 4 steps):

1. The partition rule requires total = 240+110+80 = 430 cases.
2. Printed total = 420; printed − calculated = -10 cases.
3. The secondary rule A+B>C gives 350>80, so it is satisfied.
4. Without an independent source for A, B, C, or the total, we can show that the set is inconsistent but cannot determine uniquely which entry is wrong.

**Source answer.** No. The category sum is 430, while the printed total differs by -10 cases. The inconsistency is demonstrable, but the incorrect cell cannot be identified uniquely from these data alone. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** No: category sum 430; printed total differs by -10 cases.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
