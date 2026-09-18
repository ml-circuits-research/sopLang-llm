# Explanation 629 — Rain and lateness — East Wharf notebook — case 9

## Explanation

1. The notes from East Wharf count 7 late mornings out of 10 rainy ones and 2 out of 10 dry ones.
2. The rainy rate is higher, which is what Pia reports, but 3 rainy mornings were still on time, so rain is not a guarantee.
3. Omar overreads the raised rate and Rafi throws the counts away for being small.
4. Small notes are noisy, yet they are not blank: the counts support a raised rate and nothing stronger.

Reference solution as printed in the source (section 63, 5 steps):

1. Speak in rates: 7/10 versus 2/10.
2. 7/10 is not 10/10.
3. 2/10 is not 0/10.
4. Small notes are noisy; they are not blank.
5. Conditional counts are not destinies.

## Result

**Answer.** A higher late-rate on rainy mornings in this notebook, not a guarantee.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
