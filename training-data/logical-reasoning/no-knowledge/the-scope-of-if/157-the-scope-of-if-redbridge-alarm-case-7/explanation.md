# Explanation 157 — The scope of if — Redbridge alarm — case 7

## Explanation

1. The card in Redbridge attaches the exit to one trigger: an alarm running continuously for more than 10 seconds, which is what "continuously" and the duration together write.
2. The alarm in the case sounds in bursts with pauses and never runs for 10 seconds at a stretch, so the pattern fails the written trigger.
3. Dora leaves by the east gate anyway and calls it the same rule, but the sentence never reached that pattern, and Fran widens the trigger because bursts feel worse.
4. Eli states the honest line: the sentence does not decide the intermittent case, so the choice there is uncovered rather than permitted.

Reference solution as printed in the source (section 16, 5 steps):

1. Write the trigger exactly.
2. Bursts-with-pauses fail that trigger.
3. A stronger-feeling pattern is not an automatic widening.
4. Silence is not a secret extra clause.
5. Measure the trigger first.

## Result

**Answer.** Only a continuous alarm longer than 10 seconds. The intermittent pattern is not covered. “The text is silent” is the adult line.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
