# Explanation 501 — The same clay, two fates — variant 1

## Explanation

1. The club of Station Quarter measures density as mass divided by volume, so the 20 g of clay divided by the 8 cm³ of the solid cube gives 2.50, above the water density of 1 g/cm³, and the cube sinks.
2. The same 20 g shaped into a boat displaces 25 cm³, so the average density falls to 0.80, below water, and the boat floats.
3. The trapped air is what lowers the average density of the whole: the mass never changes, but the volume the shape pushes aside grows from 8 cm³ to 25 cm³, and the sheet reads a density equal to water as suspended.

Reference material as printed in the source:

Same mass, different volume. Shape changes the volume of the whole. No outside textbook is needed: the density rule is on the sheet.

## Result

**Answer.** Cube 2.50 > 1 → sinks. Boat 0.80 < 1 → floats.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
