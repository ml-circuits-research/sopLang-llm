# Explanation 748 — Intervals, bounds, and possibility

## Explanation

1. The accepted zone is the closed interval [6,10] °C-model, so acceptance is certain only when the whole sample interval lies inside it, and rejection is certain only when the sample shares no value with it.
2. Each sample is compared by its two endpoints: a sample is certainly accepted when its lower bound is at least 6 and its upper bound at most 10, and certainly rejected when it lies wholly below 6 or wholly above 10.
3. A is certainly rejected, B is certainly accepted, C is uncertain, D is certainly rejected.
4. Only C overlaps the zone without being contained in it, so a more precise measurement of C is the one that can settle an open case.

Reference solution as printed in the source (form 28, 4 steps):

1. Certain acceptance requires the sample’s entire interval to lie within [6,10].
2. Certain rejection requires the sample interval not to overlap the accepted zone at all.
3. If the intervals overlap only partially, the sample is uncertain and a more precise measurement can resolve the case.
4. Classification is: A=certainly rejected, B=certainly accepted, C=uncertain, D=certainly rejected. The natural candidate for remeasurement is C.

## Result

**Answer.** A: certainly rejected, B: certainly accepted, C: uncertain, D: certainly rejected; remeasurement is useful for C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
