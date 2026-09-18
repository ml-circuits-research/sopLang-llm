# Explanation 440 — A hidden third column — Kalmford shoes — case 10

## Explanation

1. The notes in Kalmford show that people who buy the expensive running shoes also log more kilometres, so the two columns move together.
2. Una names an unseparated third factor — already being a keen runner — which may buy both the shoes and the kilometres.
3. Sol reads the shoes as the cause and Wes reads the price as one, but the table as written does not separate help from selection.

Reference solution as printed in the source (section 44, 5 steps):

1. Confounder = unseparated third factor.
2. Who chooses expensive shoes?
3. Those people may already run.
4. Selection masquerades as treatment.
5. Need a contrast that breaks the bundle.

## Result

**Answer.** Keenness can sit behind both columns. The table as written does not separate help from selection.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
