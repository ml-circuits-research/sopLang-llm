# Explanation 17.19 — Ratio Preserved in a Table 4

## Explanation

1. Each built combination is identical to the base one, so the ratio between the two types of objects is preserved in every copy.
2. One base combination holds 5 objects of type A and 8 of type B, and there are 4 combinations.
3. Multiplying each base count by 4 gives 20 objects of type A and 32 of type B, so the ratio 5:8 survives.

Reference solution as printed in the source (chapter 17, 3 steps):

1. For A: 5 repeated 4 times gives 20.
2. For B: 8 repeated 4 times gives 32.
3. Both were scaled by the same factor 4.

## Result

**Answer.** A=20, B=32.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
