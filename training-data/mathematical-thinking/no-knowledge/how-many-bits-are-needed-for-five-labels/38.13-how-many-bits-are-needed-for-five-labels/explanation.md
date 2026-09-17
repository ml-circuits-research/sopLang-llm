# Explanation 38.13 — How many bits are needed for five labels?

## Explanation

1. A code of length n has 2^n distinct words, so the length must be large enough that this count reaches 5.
2. Two bits give only 4 words, while three bits give 8, which is at least 5.
3. The minimum length is therefore 3 bits.

Reference solution as printed in the source (chapter 38, 4 steps):

1. Two positions provide only 4 codes.
2. There are 5 objects, so that is not enough.
3. Three positions provide 8.
4. Therefore the minimum is 3 bits.

## Result

**Answer.** 3 bits.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
