# Explanation 31.8 — Probability of a sum from two simplified coins

## Explanation

1. Two independent tokens that each show 0 or 1 give four equally likely pairs, so the outcome space is the listed set of pairs.
2. A pair is favorable when its two digits add up to 1, and 2 of the 4 pairs satisfy that.
3. The probability is therefore 1/2.

Reference solution as printed in the source (chapter 31, 4 steps):

1. Compute the sums: 00→0, 01→1, 10→1, 11→2.
2. Two pairs give sum 1.
3. There are four pairs total.
4. The probability is 2/4=1/2.

## Result

**Answer.** 1/2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
