# Explanation 25.20 — A growth rule in a drawing

## Explanation

1. The rule states a constant growth: 2 dots are added for every new figure after the first.
2. Reaching figure 5 means applying that growth 4 times to the starting 2 dots.
3. So figure 5 has 2 + 4×2 = 10 dots.

Reference solution as printed in the source (chapter 25, 4 steps):

1. Figure 4 has 6+2=8 dots.
2. Figure 5 has 8+2=10.
3. In this model we can also check with 2×5=10.
4. The growth rule was applied four times from figure 1 to figure 5.

## Result

**Answer.** 10 dots.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
