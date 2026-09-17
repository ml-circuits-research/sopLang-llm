# Explanation 7.11 — Two Successive Transfers 1

## Explanation

1. A transfer decreases the source and increases the destination by the same amount, so the first move changes A to 25 - 4 = 21 and B to 18 + 4 = 22.
2. The second move reverses direction: it takes 3 from B and gives them back to A.
3. The final counts are A = 21 + 3 = 24 and B = 22 - 3 = 19.
4. The two boxes still hold 43 tokens together, the same total as at the start.

Reference solution as printed in the source (chapter 7, 3 steps):

1. After the first transfer: A=21, B=22.
2. After the second: A=21+3=24, B=22-3=19.
3. The initial total is 43, and the final total is 43; the equality confirms that no tokens were lost.

## Result

**Answer.** A=24, B=19.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
