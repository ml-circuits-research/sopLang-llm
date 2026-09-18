# Explanation 661 — Smoke before the alarm — variant 1

## Explanation

1. The account runs 10:00 (oven on), 10:10 (new tray in), 10:28 (smoke alarm) and 10:30 (new tray out), so the smoke and the alarm are separated in time and the alarm comes second.
2. The old tray forgotten on top had fat, and the fat in the hot oven is what produced the smoke, so the chain runs old tray → smoke → alarm.
3. The new tray came out raw, which contradicts the neighbour's claim that it burned, and it went in only after the oven was already on.
4. The alarm is a detector: it reacts to smoke, so it does not produce smoke, and none of the two neighbour claims matches the account.

Reference material as printed in the source:

Time stamps block reversal. Raw ≠ burned. A chronology is a list with arrows.

## Result

**Answer.** Old tray → smoke → alarm. The new tray is raw, not burned. The alarm does not produce smoke.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
