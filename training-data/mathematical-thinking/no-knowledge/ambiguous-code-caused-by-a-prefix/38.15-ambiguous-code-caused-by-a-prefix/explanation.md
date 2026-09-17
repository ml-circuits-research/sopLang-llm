# Explanation 38.15 — Ambiguous code caused by a prefix

## Explanation

1. When one codeword is the beginning of another, a string can be split in more than one way.
2. Here the codeword 0 is a prefix of 01, so 01 can be read as the single symbol B or as 0 followed by 1.
3. The same bits therefore carry two different messages, which is exactly the ambiguity.

Reference solution as printed in the source (chapter 38, 4 steps):

1. If we read the two characters together, 01 is the code for B.
2. If we split after the first character, 0 is A and 1 is C.
3. The same string therefore has two valid decodings: B and AC.
4. The coding does not allow unique decoding.

## Result

**Answer.** Ambiguity occurs: 01 can be B or AC.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
