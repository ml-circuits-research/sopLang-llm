# Explanation 1.4 — Order in a Line 4

## Explanation

1. The clues form a chain of "before" relations over 4 children, so each clue can be read as an inequality of positions.
2. Taking the transitive closure of the clues gives every child the set of children that must stand earlier.
3. Counting those predecessors orders the line without any guessing: Ioana < Sofia < Tudor < Vlad.
4. The first position belongs to Ioana and the last to Vlad, and no other order satisfies all clues at once.

Reference solution as printed in the source (chapter 1, 4 steps):

1. From the clue “Ioana before Sofia,” write Ioana < Sofia.
2. From “Sofia before Tudor,” we get Sofia < Tudor; linking the first two relations gives Ioana < Sofia < Tudor.
3. From “Tudor before Vlad,” add the final element: Ioana < Sofia < Tudor < Vlad.
4. Since there are four children and four positions, this chain determines exactly one order.

## Result

**Answer.** Ioana, Sofia, Tudor, Vlad.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
