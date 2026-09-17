# Explanation 31.7 — Probability of an even number

## Explanation

1. An event made of several outcomes is counted by listing exactly the outcomes that satisfy it, then sharing the total number of equally likely outcomes.
2. The even faces among 1 to 6 are the listed values, and 3 of them lie in the range.
3. The count gives 3/6, which reduces to 1/2.

Reference solution as printed in the source (chapter 31, 4 steps):

1. List all outcomes: 1–6.
2. The even outcomes are 2,4,6: three outcomes.
3. The fraction is 3/6.
4. This is equivalent to 1/2.

## Result

**Answer.** 3/6=1/2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
