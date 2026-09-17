# Explanation 1.3 — Order in a Line 3

## Explanation

1. The clues form a chain of "before" relations over 4 children, so each clue can be read as an inequality of positions.
2. Taking the transitive closure of the clues gives every child the set of children that must stand earlier.
3. Counting those predecessors orders the line without any guessing: Matei < Radu < Ioana < Sofia.
4. The first position belongs to Matei and the last to Sofia, and no other order satisfies all clues at once.

Reference solution as printed in the source (chapter 1, 4 steps):

1. From the clue “Matei before Radu,” write Matei < Radu.
2. From “Radu before Ioana,” we get Radu < Ioana; linking the first two relations gives Matei < Radu < Ioana.
3. From “Ioana before Sofia,” add the final element: Matei < Radu < Ioana < Sofia.
4. Since there are four children and four positions, this chain determines exactly one order.

## Result

**Answer.** Matei, Radu, Ioana, Sofia.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
