# Explanation 17.20 — Ratio Preserved in a Table 5

## Explanation

1. Each built combination is identical to the base one, so the ratio between the two types of objects is preserved in every copy.
2. One base combination holds 6 objects of type A and 9 of type B, and there are 3 combinations.
3. Multiplying each base count by 3 gives 18 objects of type A and 27 of type B, so the ratio 6:9 survives.

Reference solution as printed in the source (chapter 17, 3 steps):

1. For A: 6 repeated 3 times gives 18.
2. For B: 9 repeated 3 times gives 27.
3. Both were scaled by the same factor 3.

## Result

**Answer.** A=18, B=27.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
