# Explanation 1.2 — Order in a Line 2

## Explanation

1. The clues form a chain of "before" relations over 4 children, so each clue can be read as an inequality of positions.
2. Taking the transitive closure of the clues gives every child the set of children that must stand earlier.
3. Counting those predecessors orders the line without any guessing: Daria < Luca < Matei < Radu.
4. The first position belongs to Daria and the last to Radu, and no other order satisfies all clues at once.

Reference solution as printed in the source (chapter 1, 4 steps):

1. From the clue “Daria before Luca,” write Daria < Luca.
2. From “Luca before Matei,” we get Luca < Matei; linking the first two relations gives Daria < Luca < Matei.
3. From “Matei before Radu,” add the final element: Daria < Luca < Matei < Radu.
4. Since there are four children and four positions, this chain determines exactly one order.

## Result

**Answer.** Daria, Luca, Matei, Radu.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
