# Explanation 935 — Had they left earlier — Long Hill bus — case 5

## Explanation

1. The notes from Long Hill record a bus that left on its printed minute and Leo arriving after it, so the traveller missed it.
2. Mira’s counterfactual changes only the traveller’s clock and holds the printed leaving rule fixed, so it is licensed by the page.
3. Quinn’s counterfactual has the bus waiting out of sentiment, which rewrites the bus’s rule and finds no grant anywhere in the notes.

Reference solution as printed in the source (section 94, 5 steps):

1. Counterfactual = a causal sentence about a world that did not happen.
2. Licensed change: the traveller’s clock.
3. Unlicensed change: the bus becoming sentimental.
4. Write the held-fixed list.
5. Bravery is a second story.

## Result

**Answer.** Mira’s. It changes arrival time and holds the printed leaving rule. Quinn changes the bus’s rule without a licence.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
