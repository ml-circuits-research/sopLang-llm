# Explanation 180 — Reading and explaining data

## Explanation

1. Only the factor “sieve mesh size” was changed, so the tested levels 1, 2, 4 are the whole interval the data speak about.
2. Reading the results in the same order, 2, 5, 8, shows that the result increases within the interval tested.
3. Because no other condition changed in the model experiment, the association can be attributed to this factor, but only for the conditions of the experiment.
4. The conclusion stops at the largest tested level: nothing is claimed about untested levels, and a local pattern is not turned into a universal rule.

Reference solution as printed in the source (form 10, 4 steps):

1. We order the levels of the factor: 1, 2, 4.
2. We compare the results in the same order: 2, 5, 8; in the interval tested, the result increases.
3. Because the problem says that only the tested factor changed, the observed association can be attributed to that factor in this model experiment.
4. We do not claim what happens at untested levels, and we do not turn a local pattern into a universal rule.

## Result

**Answer.** In the levels tested, when “sieve mesh size” changes from 1 to 4, the result increases; the data support this relationship only for the conditions of the experiment.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
