# Explanation 36.7 — Meeting from opposite directions

## Explanation

1. Walking toward each other, both travelers shorten the gap, so it shrinks by 4 + 5 = 9 km each hour.
2. The closing rate is the sum of the speeds because the distances each covers add up to the whole gap.
3. Dividing the initial 18 km by that rate gives 2 hours until they meet.

Reference solution as printed in the source (chapter 36, 4 steps):

1. In one hour, A covers 4 km toward B.
2. B covers 5 km toward A.
3. Together they reduce the distance by 9 km per hour.
4. 18÷9=2 hours.

## Result

**Answer.** 2 hours.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
