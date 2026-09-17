# Explanation 40.9 — Defined “cut and choose” division

## Explanation

1. The second person chooses first, so for any cut the chooser seizes the piece that looks better and the first person keeps the other one.
2. The cutter therefore guarantees only the smaller of the two pieces, and maximizing that guaranteed share means making the pieces equal, which is the maximin cut.
3. An unequal cut would let the chooser take the better piece and leave the cutter with a part they consider smaller, which is exactly the risk the equal cut removes.

Reference solution as printed in the source (chapter 40, 4 steps):

1. The second person has the right to choose first.
2. The first person cannot control which piece remains.
3. If one piece is more valuable to them, they risk losing it.
4. By cutting according to their own judgment into equal parts, they are satisfied with whichever piece remains.

## Result

**Answer.** To avoid the risk of being left with a part they consider smaller.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
