# Explanation 31.11 — Exactly one success

## Explanation

1. The statement is the second half of a two-trial experiment whose setup was given just before it, so the two equally likely letters per trial are supplied as the setup fact.
2. Two binary trials give four equally likely sequences, and exactly one success happens when the single success letter appears once.
3. 2 of the 4 sequences satisfy that, so the probability is 1/2.

Reference solution as printed in the source (chapter 31, 4 steps):

1. AA has two successes, so it is excluded.
2. AB and BA have exactly one.
3. BB has zero.
4. There are 2 favorable outcomes out of 4.

## Result

**Answer.** 1/2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
