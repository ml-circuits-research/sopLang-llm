# Explanation 24.10 — A stated maximum error

## Explanation

1. "At most 1 below" allows a real temperature as low as 19°C and "at most 1 above" allows one as high as 21°C.
2. Every value between the two limits is compatible with the reading, so the real temperature lies in the interval 19–21°C.

Reference solution as printed in the source (chapter 24, 4 steps):

1. “At most 1 below” allows a value as low as 19°C.
2. “At most 1 above” allows a value as high as 21°C.
3. Values between these limits are compatible with the reading.
4. The interval is 19–21°C.

## Result

**Answer.** Between 19°C and 21°C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
