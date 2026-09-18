# Explanation 182 — Enough for 44 people — variant 2

## Explanation

1. The sheet starts from the confirmed count of 44 people in Bridge City, and the salad line is the one that does not round: 200 g per person gives 8800 g.
2. Bread and drink are rounded up to whole units, so 44 people take 15 loaves at one loaf per three and 11 bottles at one bottle per four.
3. The 50% reserve belongs to an uncertain list, and today's list is certain, so the 10 extra loaves Elena wants just in case break the rule instead of extending it.

Reference material as printed in the source:

Rounding up is a written safety ceiling, not a feeling of panic at the shelf. The 50% reserve has a false condition today.

## Result

**Answer.** Loaves 15, salad 8800 g, bottles 11. +10 breaks the rule: the list is certain.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
