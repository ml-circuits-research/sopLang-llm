# Explanation 776 — Megabits, not gigabytes — variant 6

## Explanation

1. The sheet converts the unit first: 8000 Mb at 8 Mb/s takes 1000 s, which is about 16 min per gigabyte, because 8 bits make a byte and the rate is megabits, not megabytes.
2. Ned treats 8 Mb/s as 8 GB/s, so the instant start for 5 people cannot be right on the same line.
3. In the equal model the 8 Mb/s line gives 1 Mb/s to each of the 8 sharers, so each person waits about 8 times longer than alone.

Reference material as printed in the source:

The Mb/s vs GB/s confusion is thousands of times. A network is a flow, not a magic tap.

## Result

**Answer.** One person: ~16 min/GB. Eight people: about 8 times slower.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
