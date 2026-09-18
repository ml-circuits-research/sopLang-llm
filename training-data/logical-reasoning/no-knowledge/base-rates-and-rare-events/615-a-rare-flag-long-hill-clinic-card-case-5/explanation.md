# Explanation 615 — A rare flag — Long Hill clinic card — case 5

## Explanation

1. The card from Long Hill puts about 1 case of condition K in a crowd of 1000, and the test catches 99 of 100 real cases.
2. That yields about 1 true flag, while the 999 healthy people contribute about 10 false flags at a rate of 1 in 100.
3. Mira counts both numbers, whereas Leo and Quinn read the flag or the sensitivity as if the base rate did not matter.
4. With a rare condition the healthy crowd dominates the flags, so most flagged people are not K cases.

Reference solution as printed in the source (section 62, 5 steps):

1. Base: 1 in 1000.
2. True flags ≈ 1.
3. False flags ≈ 1% of 999 ≈ 10.
4. About 11 flags, 1 true.
5. Sensitivity plus rarity still yields mostly false flags.

## Result

**Answer.** No. About one true flag beside about ten false flags. Catching almost all real K does not make a flag trustworthy when K is rare.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
