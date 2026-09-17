# Explanation 28.8 — Paths with two successive choices

## Explanation

1. Every path is built by choosing a first-step destination and then a second-step destination.
2. Each of the 2 first steps offers the same 3 second steps.
3. 2 × 3 = 6 paths.

Reference solution as printed in the source (chapter 28, 4 steps):

1. The first choice has 2 possibilities.
2. After each, the second choice has 3 possibilities.
3. Each pair of choices describes a distinct path.
4. 2×3=6.

## Result

**Answer.** 6 paths.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
