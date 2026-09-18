# Explanation 898 — One end of a table — variant 8

## Explanation

1. The table moves only with two people, and only Olga is lifting an end, so the second person is missing.
2. The narrow door rules out Olga carrying the table alone, and dragging it on the floor is forbidden, so no single-person route remains.
3. Piotr is on the phone in the yard for 17 minutes, so the second pair of hands is held by the call rather than by the door.

Reference material as printed in the source:

A role dependency: 2 > 1. “Creative solutions” are closed by a rule. Cooperation is sometimes arithmetic of heads.

## Result

**Answer.** No. The second person is missing. The floor is not an allowed path. Piotr’s phone holds the resource.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
