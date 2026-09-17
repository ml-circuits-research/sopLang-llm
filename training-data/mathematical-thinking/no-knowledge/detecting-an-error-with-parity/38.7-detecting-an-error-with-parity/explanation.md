# Explanation 38.7 — Detecting an error with parity

## Explanation

1. A word is valid when it contains an even number of 1-bits, so counting the ones decides the test.
2. The received word 1011 has 3 ones, an odd count that breaks the rule.
3. Therefore an error is detected and the message is invalid.

Reference solution as printed in the source (chapter 38, 4 steps):

1. Count the 1-bits: three.
2. Three is odd.
3. A valid word should have an even number.
4. Therefore the received message is detected as invalid; at least one error or rule violation has occurred.

## Result

**Answer.** The message is invalid / an error is detected.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
