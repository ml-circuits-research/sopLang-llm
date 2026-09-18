# Explanation 435 — The excess that is subtracted first — variant 5

## Explanation

1. The policy covers fire, theft with forced entry, and water from pipes, so the smashed window puts the theft on the covered side of the list; the notice of 24 h is inside the printed 48 h window.
2. The excess is taken from each covered loss, so of the 470 claimed the insurer keeps the first 320 and pays the remaining 150.
3. Ann never declared the ring, and its value of 3000 is over the printed limit of 2000, so the object falls on the separate exclusion even though it was taken in the same theft.

Reference material as printed in the source:

A yes/no list plus a threshold. Notice is in time. An object from the same theft can still fall on a separate exclusion.

## Result

**Answer.** Forced entry is covered: (320+150)−320=150. The ring is excluded (undeclared and >2000).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
