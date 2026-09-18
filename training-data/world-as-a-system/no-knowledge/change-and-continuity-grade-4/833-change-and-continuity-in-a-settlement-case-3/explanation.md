# Explanation 833 — Change and continuity in a settlement: case 3

## Explanation

1. Period 1 features are ['footpath', 'market', 'mill', 'well', 'wooden bridge'] and Period 2 features are ['market', 'mill', 'road', 'stone bridge', 'well'].
2. The intersection of the two lists gives the continuities ['market', 'mill', 'well'].
3. Removing the Period 2 features from Period 1 gives the disappearances ['footpath', 'wooden bridge'], and removing the Period 1 features from Period 2 gives the appearances ['road', 'stone bridge'].
4. The three conclusions are direct set comparisons, so they follow from the two lists alone; only a role-based replacement claim would need information the problem does not state.

Reference solution as printed in the source (family H7, 4 steps):

1. Intersection gives continuities: ['market', 'mill', 'well'].
2. Period1−Period2 gives disappearances: ['footpath', 'wooden bridge'].
3. Period2−Period1 gives appearances: ['road', 'stone bridge'].
4. Only role-based replacement would require extra information; the set comparisons are direct. Cross-domain check: 8+2=10, so the team finishes at 10:00.

## Result

**Answer.** Continuities: ['market', 'mill', 'well']; disappearances: ['footpath', 'wooden bridge']; appearances: ['road', 'stone bridge']. Cross-domain answer: 10:00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
