# Explanation 193 — Inferring a hidden state

## Explanation

1. The model declares the causes complete and gives each of the 3 causes the signs it can produce.
2. The observed sign “the object blocks the light” is looked up in those lists, which keeps only the causes able to produce it.
3. The other causes are eliminated because none of their listed signs is the observed one, so the hidden state is “Screen positioned incorrectly”.
4. The step from effect to cause is licensed by the closed model of the problem; outside it, the cause list need not be complete.

Reference solution as printed in the source (form 8, 4 steps):

1. We look for all the causes whose listed signs include “the object blocks the light”.
2. The compatible causes are: screen positioned incorrectly.
3. We eliminate causes that cannot produce the observed sign according to the explicit rules.
4. The observation supports the conclusion only in the closed model of the problem; in the real world there could be unlisted causes.

## Result

**Answer.** The hidden state is “screen positioned incorrectly”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
