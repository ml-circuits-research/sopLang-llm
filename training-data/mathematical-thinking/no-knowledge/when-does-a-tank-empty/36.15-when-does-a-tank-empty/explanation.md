# Explanation 36.15 — When does a tank empty?

## Explanation

1. Nothing enters, so the tank loses 6 L every minute until everything is gone.
2. Counting how many groups of 6 L fit into the 36 L, the tank reaches 0 after 6 minutes.

Reference solution as printed in the source (chapter 36, 4 steps):

1. Each minute, 6 L are lost.
2. Find how many losses of 6 add to 36.
3. 36÷6=6.
4. At minute 6, the tank reaches exactly 0.

## Result

**Answer.** 6 minutes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
