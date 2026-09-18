# Explanation 254 — Position chain from Willow to Stone

## Explanation

1. Start Willow at (0,0) and translate each stated relation into a coordinate move.
2. Following the stated moves from Willow to Stone adds up to (-2,-2).
3. That coordinate places Stone south-west of Willow, and the grid displacement is |-2|+|-2|=4.

Reference solution as printed in the source (family G1, 4 steps):

1. Start Willow at (0,0).
2. Translate each relation into a coordinate move.
3. Adding the moves gives (-2,-2).
4. That coordinate is south-west of Willow; the grid displacement is |-2|+|-2|=4.

## Result

**Answer.** Stone is south-west of Willow; grid displacement 4 unit(s).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
