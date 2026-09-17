# Explanation 31.5 — The same probability in two different bags

## Explanation

1. Comparing chances across different totals means comparing the fractions 1/2 and 2/4 without decimals.
2. Cross-multiplying compares them exactly: multiply the numerator of each fraction by the denominator of the other.
3. 1×4 and 2×2 are the same product, so the two fractions represent the same chance and neither bag is better.

Reference solution as printed in the source (chapter 31, 4 steps):

1. In A, the favorable fraction is 1/2.
2. In B, it is 2/4.
3. Two out of four is one half, just like one out of two.
4. The probabilities are equal.

## Result

**Answer.** They are equal.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
