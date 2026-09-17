# Explanation 38.19 — Decoding with a one-to-one dictionary

## Explanation

1. The dictionary maps each colour to a number, and because the mapping is one-to-one the same table can be read backwards.
2. Each number is replaced by the colour it names, so 5 becomes green, 5 becomes green, 2 becomes red.
3. The decoded message is green-green-red.

Reference solution as printed in the source (chapter 38, 4 steps):

1. Look up each code in the dictionary.
2. 5 means green both times.
3. 2 means red.
4. The message is green-green-red.

## Result

**Answer.** green-green-red.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
