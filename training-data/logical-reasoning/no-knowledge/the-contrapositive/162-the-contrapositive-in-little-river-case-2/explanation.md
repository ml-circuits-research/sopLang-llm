# Explanation 162 — The contrapositive in Little River — case 2

## Explanation

1. The card states one conditional: rain in the last hour gives a wet market pavement.
2. Ben turns that conditional around by denying the back — no wet pavement, no rain — which is the contrapositive the card already licenses.
3. Cara turns it around the other way, from a wet pavement to rain, which is the converse and a new claim.
4. The new claim needs a new premise, because wetness can arrive by a street-cleaning truck without any rain.

Reference solution as printed in the source (section 17, 5 steps):

1. From “if A then B” you may pass to “if not B then not A.”
2. You may not pass to “if B then A.”
3. Contrapositive = same link, turned around.
4. Converse = extra claim.
5. Rearranging two letters is not one operation.

## Result

**Answer.** Only Ben’s twin — the contrapositive. Cara wrote the converse, a new claim. Wetness can arrive by a street-cleaning truck.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
