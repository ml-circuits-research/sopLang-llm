# Explanation 505 — Ranking the stories — Long Hill dark lamp — case 5

## Explanation

1. The lamp in Long Hill is dark while the switch is on and the neighbouring lamp on the same listed socket-strip is lit, so the dark lamp is the only broken thing on the page.
2. Leo offers a dead bulb, which fits a dark lamp beside a working neighbour, so that story is the one that starts first.
3. Mira offers a failure of the town’s whole grid, but that fights the lit neighbour lamp, and a story that contradicts a listed sign is dropped.
4. Quinn offers a hidden second switch jammed by a moth that no sign lists, so that engine is postponed, not chosen; the best story on this list is also not married to the truth.

Reference solution as printed in the source (section 51, 5 steps):

1. List what would make “dark” unsurprising.
2. Discard stories that fight a listed fact.
3. Postpone unlisted engines.
4. Best on this list ≠ married to the truth.
5. Next act: a cheap test (swap the bulb).

## Result

**Answer.** Leo’s. A dead bulb fits a dark lamp beside a working neighbour. A whole-grid failure fights the neighbour lamp. The moth adds an unlisted engine.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
