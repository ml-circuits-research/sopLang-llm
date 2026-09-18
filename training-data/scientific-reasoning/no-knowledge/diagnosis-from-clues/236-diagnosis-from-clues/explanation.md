# Explanation 236 — Diagnosis from clues

## Explanation

1. The model offers 3 possible causes, each with the signs it would produce: source active, Pollutant old in sediments, Measurement wrong.
2. The observations are level large near of source, level increases after each discharge, so a cause fits only if its sign list contains every observed sign and no sign that was not observed.
3. The other causes each miss at least one observed sign or predict a sign that the observation contradicts, while “source active” is compatible with all of the data.
4. The diagnosis concludes inside the closed model of the problem, not about causes outside it.

Reference solution as printed in the source (form 6, 4 steps):

1. For each cause, we build the list of signs we should expect to see.
2. The observed signs are exactly compatible with “source active”: level large near of source, level increases after each discharge.
3. We compare with the other causes: each misses at least one sign or would require a sign different from those observed.
4. The conclusion is a diagnosis within the model, not a general medical or biological claim outside it.

## Result

**Answer.** The cause supported by the data is “source active”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
