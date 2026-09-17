# Explanation 23.12 — The additional question that is needed

## Explanation

1. A question separates the two possibilities only when it has a different answer for each of them.
2. The small and red questions receive the same answer for both objects, while the flat-face question is answered differently because a cube has flat faces and a sphere does not.

Reference solution as printed in the source (chapter 23, 4 steps):

1. “Is it small?” has answer yes for both.
2. “Is it red?” also has answer yes for both.
3. “Does it have flat faces?” is yes for the cube and no for the sphere.
4. This question separates the candidates.

## Result

**Answer.** “Does it have flat faces?”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
