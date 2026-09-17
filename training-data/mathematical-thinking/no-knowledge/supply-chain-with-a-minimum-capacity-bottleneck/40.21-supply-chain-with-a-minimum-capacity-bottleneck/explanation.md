# Explanation 40.21 — Supply chain with a minimum-capacity bottleneck

## Explanation

1. Every object must pass through all stages (A=10, B=6, C=8), so no stage can be bypassed.
2. The stable throughput of such a line is set by the slowest stage, because a faster stage only builds up waiting work.
3. The smallest capacity is the bottleneck, and that value is the maximum stable number of objects per hour the system can produce.

Reference solution as printed in the source (chapter 40, 4 steps):

1. Every object must be processed by B.
2. B can process at most 6 per hour.
3. Even though A and C can handle more, extra objects would accumulate before B.
4. The maximum stable throughput is 6.

## Result

**Answer.** 6 objects/hour.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
