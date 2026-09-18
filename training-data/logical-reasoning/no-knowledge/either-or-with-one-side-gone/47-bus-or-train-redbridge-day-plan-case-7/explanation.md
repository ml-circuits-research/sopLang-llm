# Explanation 47 — Bus or train — Redbridge day plan — case 7

## Explanation

1. The plan of Redbridge is a closed disjunction: BUS or TRAIN, with no third means listed.
2. The only morning bus is cancelled, so that side is gone, and the train is on time, so Dora is right inside the plan.
3. Eli adds walk, a means the plan never listed, so that reading is not drawn from the plan.
4. Fran keeps the cancelled bus alive as a live option, but "or" is not a repair shop and the plan cannot restore what it has cancelled.

Reference solution as printed in the source (section 5, 5 steps):

1. Closed disjunction: bus or train.
2. One listed side is gone; the other remains.
3. Walking is not listed here.
4. “Or” is not a repair shop.
5. Harvest options only from the plan.

## Result

**Answer.** Dora is right inside the plan. Eli invents a third means. Fran restores a cancelled option the plan cannot restore.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
