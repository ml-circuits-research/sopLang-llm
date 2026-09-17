# Explanation 7.12 — Two Successive Transfers 2

## Explanation

1. A transfer decreases the source and increases the destination by the same amount, so the first move changes A to 30 - 5 = 25 and B to 22 + 5 = 27.
2. The second move reverses direction: it takes 2 from B and gives them back to A.
3. The final counts are A = 25 + 2 = 27 and B = 27 - 2 = 25.
4. The two boxes still hold 52 tokens together, the same total as at the start.

Reference solution as printed in the source (chapter 7, 3 steps):

1. After the first transfer: A=25, B=27.
2. After the second: A=25+2=27, B=27-2=25.
3. The initial total is 52, and the final total is 52; the equality confirms that no tokens were lost.

## Result

**Answer.** A=27, B=25.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
