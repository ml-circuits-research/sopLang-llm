# Explanation 715 — Planning with partial dependencies

## Explanation

1. The first level holds the tasks without prerequisites: the source is connected, the insulation is checked.
2. From there each level is built by marking the placed tasks and collecting every task whose prerequisites are all marked already, so the tasks inside one level never wait for one another and can run in parallel.
3. The task that must wait for several prerequisites is the bulb shines (after the switch is closed and current flows through the path).
4. The resulting levels are the source is connected, the insulation is checked | the switch is closed, current flows through the path | the bulb shines, and reading them in order gives a valid total ordering, because a task is only ever placed after every prerequisite it names.

Reference solution as printed in the source (form 30, 4 steps):

1. At level 1, place the tasks without prerequisites: the source is connected, the insulation is checked.
2. after each level, mark the completed tasks and check which prerequisites have now been satisfied.
3. The resulting levels are: the source is connected, the insulation is checked | the switch is closed, current flows through the path | the bulb shines.
4. A valid total order can be obtained by choosing any order within each level, without reversing any dependency: the source is connected → the insulation is checked → the switch is closed → current flows through the path → the bulb shines.

## Result

**Answer.** Plan by levels: the source is connected, the insulation is checked | the switch is closed, current flows through the path | the bulb shines.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
