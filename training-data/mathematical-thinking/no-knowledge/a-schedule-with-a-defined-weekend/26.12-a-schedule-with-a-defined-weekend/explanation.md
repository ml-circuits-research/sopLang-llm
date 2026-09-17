# Explanation 26.12 — A schedule with a defined weekend

## Explanation

1. The problem defines the weekend itself as Saturday and Sunday, so no outside calendar knowledge is needed here.
2. The activity only runs on days outside that set, which is a plain membership test on Sunday.
3. Sunday is a weekend day, so the activity cannot take place.

Reference solution as printed in the source (chapter 26, 4 steps):

1. The weekend explicitly contains Saturday and Sunday.
2. Sunday is therefore a weekend day.
3. The rule allows the activity only outside the weekend.
4. The condition is not satisfied.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
