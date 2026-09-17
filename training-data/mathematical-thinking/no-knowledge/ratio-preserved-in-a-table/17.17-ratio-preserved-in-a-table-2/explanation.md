# Explanation 17.17 — Ratio Preserved in a Table 2

## Explanation

1. Each built combination is identical to the base one, so the ratio between the two types of objects is preserved in every copy.
2. One base combination holds 3 objects of type A and 4 of type B, and there are 7 combinations.
3. Multiplying each base count by 7 gives 21 objects of type A and 28 of type B, so the ratio 3:4 survives.

Reference solution as printed in the source (chapter 17, 3 steps):

1. For A: 3 repeated 7 times gives 21.
2. For B: 4 repeated 7 times gives 28.
3. Both were scaled by the same factor 7.

## Result

**Answer.** A=21, B=28.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
