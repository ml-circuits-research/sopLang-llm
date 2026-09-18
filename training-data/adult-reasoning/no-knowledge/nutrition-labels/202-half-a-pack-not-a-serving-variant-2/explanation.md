# Explanation 202 — Half a pack, not a serving — variant 2

## Explanation

1. The label states its values per 100 g, but Hugo eats half a pack of 105 g rather than the recommended 31 g serving, so the serving size does not decide what is eaten.
2. Scaling 188 kcal and the printed salt figure to the exact half pack gives 99 kcal and 0.63 g of salt eaten, while the half weight itself is printed as 52 g with the label's own rounding.
3. The front claim is judged against the reference the pack itself prints, and 1.2<1.8, so the claim is consistent with the printed reference.

Reference material as printed in the source:

Do not use the 31 g serving: half a pack was eaten. The base is 100 g. Do not fetch a legal definition from outside the label.

## Result

**Answer.** 52 g → 99 kcal and 0.63 g salt. 1.2<1.8, so the claim is consistent with the printed reference.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
