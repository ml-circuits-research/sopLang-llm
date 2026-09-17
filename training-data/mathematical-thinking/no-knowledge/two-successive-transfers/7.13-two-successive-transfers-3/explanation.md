# Explanation 7.13 — Two Successive Transfers 3

## Explanation

1. A transfer decreases the source and increases the destination by the same amount, so the first move changes A to 28 - 6 = 22 and B to 24 + 6 = 30.
2. The second move reverses direction: it takes 4 from B and gives them back to A.
3. The final counts are A = 22 + 4 = 26 and B = 30 - 4 = 26.
4. The two boxes still hold 52 tokens together, the same total as at the start.

Reference solution as printed in the source (chapter 7, 3 steps):

1. After the first transfer: A=22, B=30.
2. After the second: A=22+4=26, B=30-4=26.
3. The initial total is 52, and the final total is 52; the equality confirms that no tokens were lost.

## Result

**Answer.** A=26, B=26.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
