# Explanation 17.18 — Ratio Preserved in a Table 3

## Explanation

1. Each built combination is identical to the base one, so the ratio between the two types of objects is preserved in every copy.
2. One base combination holds 4 objects of type A and 7 of type B, and there are 5 combinations.
3. Multiplying each base count by 5 gives 20 objects of type A and 35 of type B, so the ratio 4:7 survives.

Reference solution as printed in the source (chapter 17, 3 steps):

1. For A: 4 repeated 5 times gives 20.
2. For B: 7 repeated 5 times gives 35.
3. Both were scaled by the same factor 5.

## Result

**Answer.** A=20, B=35.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
