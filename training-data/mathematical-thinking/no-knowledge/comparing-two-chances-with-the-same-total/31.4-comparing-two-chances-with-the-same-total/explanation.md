# Explanation 31.4 — Comparing two chances with the same total

## Explanation

1. All 8 balls are equally likely, so the chance of a colour is its count out of 8.
2. The counts are 3 red and 5 blue, and they share the same total.
3. The larger count belongs to blue: 5 out of 8 beats the other colour, so blue is more likely.

Reference solution as printed in the source (chapter 31, 4 steps):

1. The total is the same for both events: 8.
2. Red has 3 favorable outcomes.
3. Blue has 5.
4. With the same denominator, 5/8>3/8.

## Result

**Answer.** Blue.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
