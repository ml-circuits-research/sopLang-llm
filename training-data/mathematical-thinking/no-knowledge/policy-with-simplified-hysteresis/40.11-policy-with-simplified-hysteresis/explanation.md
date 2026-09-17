# Explanation 40.11 — Policy with simplified hysteresis

## Explanation

1. The heating turns on below 18 and turns off only above 20, so turning off is a stricter condition than turning on.
2. The temperature now reaches 19, and the shutoff condition asks for more than 20.
3. Since 19 does not exceed 20, the heating stays on and does not turn off.

Reference solution as printed in the source (chapter 40, 4 steps):

1. At 17, the turn-on rule is satisfied.
2. The state becomes “on.”
3. At 19, the temperature does not exceed 20.
4. The system remains on.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
