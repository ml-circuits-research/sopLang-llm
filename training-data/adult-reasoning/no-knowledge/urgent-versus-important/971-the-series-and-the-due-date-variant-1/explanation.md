# Explanation 971 — The series and the due date — variant 1

## Explanation

1. The grid maps importance and urgency onto four answers: the both-cells are today, importance alone is scheduled, urgency alone is short/delegated, and neither is dropped.
2. The bill due tomorrow with the power cut is both, so chore 1 comes first as today, and the series is neither, so chore 2 lands last as dropped.
3. The “reply now” message is urgent without being important, so it takes the short, delegated slot, while the bookable medical check is important without being urgent and is scheduled.
4. The order is therefore the grid’s own precedence, not the order the chores were listed.

Reference material as printed in the source:

The rumour’s urgency and the series’ pleasure want to jump. The grid holds them down. Priority written before impulse is reasoning.

## Result

**Answer.** (1) today; (4) scheduled; (3) short/delegated; (2) dropped.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
