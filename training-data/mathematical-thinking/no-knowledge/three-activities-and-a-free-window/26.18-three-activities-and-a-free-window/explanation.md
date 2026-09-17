# Explanation 26.18 — Three activities and a free window

## Explanation

1. The busy intervals 9:00–9:30, 10:00–10:45, 11:15–12:00 carve the window 9:00–12:00 into free stretches between them.
2. Walking the busy intervals in time order and keeping the furthest end seen so far gives each free stretch as the place where the next activity starts after the previous one ended.
3. The first stretch whose length reaches 30 minutes is 9:30–10:00.

Reference solution as printed in the source (chapter 26, 4 steps):

1. The first activity ends at 9:30.
2. The next begins at 10:00.
3. There are exactly 30 minutes between them.
4. This is the first gap that satisfies the requirement.

## Result

**Answer.** 9:30–10:00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
