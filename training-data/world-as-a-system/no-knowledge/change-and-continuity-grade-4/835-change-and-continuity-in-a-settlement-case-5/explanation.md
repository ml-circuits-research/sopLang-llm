# Explanation 835 — Change and continuity in a settlement: case 5

## Explanation

1. Period 1 features are ['footpath', 'market', 'wall', 'well', 'wooden bridge'] and Period 2 features are ['market', 'park', 'road', 'stone bridge', 'well'].
2. The intersection of the two lists gives the continuities ['market', 'well'].
3. Removing the Period 2 features from Period 1 gives the disappearances ['footpath', 'wall', 'wooden bridge'], and removing the Period 1 features from Period 2 gives the appearances ['park', 'road', 'stone bridge'].
4. The three conclusions are direct set comparisons, so they follow from the two lists alone; only a role-based replacement claim would need information the problem does not state.

Reference solution as printed in the source (family H7, 4 steps):

1. Intersection gives continuities: ['market', 'well'].
2. Period1−Period2 gives disappearances: ['footpath', 'wall', 'wooden bridge'].
3. Period2−Period1 gives appearances: ['park', 'road', 'stone bridge'].
4. Only role-based replacement would require extra information; the set comparisons are direct. Cross-domain check: 11−4=7 independent reports remain. Mixed-domain verification: 85+6=91.

## Result

**Answer.** Continuities: ['market', 'well']; disappearances: ['footpath', 'wall', 'wooden bridge']; appearances: ['park', 'road', 'stone bridge']. Cross-domain answer: 7 independent reports. Mixed-domain answer: 91 map sheets.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
