# Explanation 31.6 — Probability by complement

## Explanation

1. The complement counts the outcomes that do NOT satisfy the event, over the same total of 6 equally likely faces.
2. Only one face shows the excluded value, so 5 of the 6 faces satisfy "NOT 6".
3. The probability is 5/6, which is 5/6.

Reference solution as printed in the source (chapter 31, 4 steps):

1. There are 6 possible outcomes.
2. Only one is 6.
3. The other five are “not 6”.
4. The probability is 5/6.

## Result

**Answer.** 5/6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
