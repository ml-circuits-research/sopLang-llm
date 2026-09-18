# Explanation 192 — A nested if — Little River archive — case 2

## Explanation

1. The slip nests two conditions: holding the pass releases the inner conditional, and the inner conditional asks for a clock after the stated hour.
2. Cara holds the pass and arrives after the hour, so both conjuncts hold and the drawer may be opened.
3. Ben holds the pass but arrives before the hour, so the inner door stays shut.
4. Nia arrives after the hour without a pass, and the late clock is not a substitute for the pass.

Reference solution as printed in the source (section 20, 5 steps):

1. Unpack: pass AND late hour.
2. One conjunct missing → permission not released.
3. Late hour is not a substitute for a pass.
4. Early hour leaves the inner door shut.
5. Read both “ifs.”

## Result

**Answer.** Only Cara. Ben has the pass but not the hour. Nia has the hour without the pass. A nest is not a menu from which you pick one trigger.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
