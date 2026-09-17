# Explanation 31.12 — Drawing without replacement: the second chance changes

## Explanation

1. Drawing without replacement means the drawn ball leaves the bag, so both the favorable count and the total shrink.
2. After one red ball is removed, the bag holds 1 red and 1 blue balls.
3. The next draw is red in 1 of 2 equally likely cases, so the chance is 1/2.

Reference solution as printed in the source (chapter 31, 4 steps):

1. Initially there are 3 balls.
2. We know the first drawn ball was red and has been removed.
3. Two balls remain: one red and one blue.
4. The second chance of red is 1/2.

## Result

**Answer.** 1/2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
