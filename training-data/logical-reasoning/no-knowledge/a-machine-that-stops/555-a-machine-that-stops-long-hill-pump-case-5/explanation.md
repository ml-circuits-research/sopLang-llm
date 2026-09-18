# Explanation 555 — A machine that stops — Long Hill pump — case 5

## Explanation

1. The pump in Long Hill stops with the socket lamp lit and the reset button out, which is exactly the manual’s first branch.
2. That branch says to press reset before calling a fitter, and pressing reset is the cheap listed test.
3. Leo skips the test and invents a burnt motor, an engine the listed signs do not carry.
4. Quinn dismisses the manual, but the best-first explanation follows it, so the reset comes first.

Reference solution as printed in the source (section 56, 5 steps):

1. Fit signs to the manual’s first branch.
2. Cheap test before expensive story.
3. Invented motors are unlisted.
4. Courage is not a diagnostic method.
5. Update if reset fails.

## Result

**Answer.** Try the reset. It is the listed cheap test that fits the listed signs. A burnt motor is an extra engine.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
