# Explanation 811 — One bus, every subject — variant 1

## Explanation

1. Gina reports one bus in Stadium District on one day and a wait of 15 minutes, so the observation is a single case with a single number.
2. The sentence “Every bus in Stadium District is late” turns that single case into a claim about every bus, which the stated evidence does not cover.
3. The last sentence carries the traffic complaint over to “no trust on any subject”, which is a leap to a different question rather than a further conclusion about buses.
4. A sound reading keeps the three layers apart: one observation, one generalisation, one leap.

Reference material as printed in the source:

One example does not fill “every”. Even “every bus” would not fill “every subject”. The conclusion is fatter than the premise.

## Result

**Answer.** Observed: one bus, one day, 15 min. Generalisation: every bus. Leap: from traffic to “any subject”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
