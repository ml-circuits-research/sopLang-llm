# Explanation 1.1 — Order in a Line 1

## Explanation

1. The clues form a chain of "before" relations over 4 children, so each clue can be read as an inequality of positions.
2. Taking the transitive closure of the clues gives every child the set of children that must stand earlier.
3. Counting those predecessors orders the line without any guessing: Ana < Mara < Daria < Luca.
4. The first position belongs to Ana and the last to Luca, and no other order satisfies all clues at once.

Reference solution as printed in the source (chapter 1, 4 steps):

1. From the clue “Ana before Mara,” write Ana < Mara.
2. From “Mara before Daria,” we get Mara < Daria; linking the first two relations gives Ana < Mara < Daria.
3. From “Daria before Luca,” add the final element: Ana < Mara < Daria < Luca.
4. Since there are four children and four positions, this chain determines exactly one order.

## Result

**Answer.** Ana, Mara, Daria, Luca.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
