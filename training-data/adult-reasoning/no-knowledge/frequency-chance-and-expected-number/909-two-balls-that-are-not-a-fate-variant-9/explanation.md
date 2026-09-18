# Explanation 909 — Two balls that are not a fate — variant 9

## Explanation

1. The urn holds 6 white and 2 red balls, so one draw gives red with probability 2/8, simplified to 1/4.
2. With replacement every draw repeats the same odds, so 8 draws expect 2 reds on average, but an average is not a guarantee.
3. Rita multiplies the fraction by the number of draws and calls the result obligatory; the draws stay independent, so a run of 8 draws with zero reds is possible and simply more or less likely.

Reference material as printed in the source:

With replacement, P stays. A mean over many series ≠ the fate of this series. Obligatory needs P=1.

## Result

**Answer.** P=2/8=1/4. Expected number in 8 draws = 2, not certainty. Zero reds can occur.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
