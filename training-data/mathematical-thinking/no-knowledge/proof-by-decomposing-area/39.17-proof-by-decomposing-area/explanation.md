# Explanation 39.17 — Proof by decomposing area

## Explanation

1. The rectangle is cut into a rows with b unit squares in each row.
2. Counting the rows times the squares per row gives the total number of unit squares, which is the area.

Reference solution as printed in the source (chapter 39, 4 steps):

1. Each row has b unit squares.
2. There are a rows with the same number of cells.
3. The total number is b added a times.
4. This is the definition of the product a×b.

## Result

**Answer.** The area is a×b unit squares.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
