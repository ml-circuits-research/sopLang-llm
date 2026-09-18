# Explanation 536 — A closed leaflet — Port Asher pharmacy card — case 6

## Explanation

1. The leaflet from Port Asher forks on its own printed bundles: the first bundle needs a dry cough with the fever band and no rash, the second needs a rash with fever.
2. Ade has exactly the first bundle, so the first printed path is that reader’s best fit.
3. Bela arrives with a rash, which the leaflet uses as the fork, so the second bundle is the better match even though the first path was used.
4. Chris treats the leaflet as timid, but a printed fork is still what decides the best fit.

Reference solution as printed in the source (section 54, 5 steps):

1. Match bundles to bundles.
2. A leftover rash is not decoration if the card used it as a fork.
3. Best printed fit ≠ a home-made disease name.
4. Timidity of a leaflet is not a licence.
5. Closed lists are the point of this problem.

## Result

**Answer.** Ade’s symptoms match the first printed bundle. Bela matches the second bundle.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
