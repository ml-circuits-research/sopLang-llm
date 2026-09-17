# Explanation 30.21 — Identifying a transformation from its effect

## Explanation

1. The arrow pointed right and now points left, so its horizontal direction is reversed while the vertical direction is unchanged.
2. A translation preserves orientation, but a vertical reflection reverses left and right and keeps up and down, the property the circuit reads from its fact wire.
3. The effect is therefore a vertical reflection.

Reference solution as printed in the source (chapter 30, 4 steps):

1. Size does not distinguish the two because both preserve it.
2. Translation does not change the arrow's direction.
3. Vertical reflection changes right into left while preserving up-down.
4. The effect matches a vertical reflection.

## Result

**Answer.** Vertical reflection.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
