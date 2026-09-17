# Explanation 28.25 — Number of handshakes

## Explanation

1. Each handshake is an unordered pair of the 4 children.
2. Ordering the pairs first gives 4 × 3, which counts each pair twice.
3. Halving that count gives 6 handshakes.

Reference solution as printed in the source (chapter 28, 4 steps):

1. A greets B,C,D: 3 handshakes.
2. B still needs to greet C,D: 2 new handshakes.
3. C still greets D: 1 new handshake.
4. D's greetings with the others were already counted. Total 3+2+1=6.

## Result

**Answer.** 6 handshakes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
