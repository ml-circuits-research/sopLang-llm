# Explanation 17.16 — Ratio Preserved in a Table 1

## Explanation

1. Each built combination is identical to the base one, so the ratio between the two types of objects is preserved in every copy.
2. One base combination holds 2 objects of type A and 5 of type B, and there are 6 combinations.
3. Multiplying each base count by 6 gives 12 objects of type A and 30 of type B, so the ratio 2:5 survives.

Reference solution as printed in the source (chapter 17, 3 steps):

1. For A: 2 repeated 6 times gives 12.
2. For B: 5 repeated 6 times gives 30.
3. Both were scaled by the same factor 6.

## Result

**Answer.** A=12, B=30.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
