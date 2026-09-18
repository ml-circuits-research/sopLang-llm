# Explanation 122 — Interest that does not bite itself — variant 2

## Explanation

1. The poster fixes simple interest as capital × yearly rate × months/12, so 2400.00 at 7% for 4 months gives 56.00.
2. The sum at term is the capital plus that interest alone, 2456.00; no interest is charged on interest.
3. The late line is a separate charge of 1% of the capital, which is 24.00 and does not include the interest.
4. Olga brings the money exactly on time in Bridge City, so no late line is added.

Reference material as printed in the source:

Simple means: no interest on interest. The formula is applied literally. The late line is another formula, still on capital. Always read whether interest is simple or compound; here it is written.

## Result

**Answer.** Interest 56.00. At term 2456.00. One late month: +24.00 (1% of capital, not of the total).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
