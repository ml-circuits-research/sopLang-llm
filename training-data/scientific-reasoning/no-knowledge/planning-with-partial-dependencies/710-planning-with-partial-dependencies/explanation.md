# Explanation 710 — Planning with partial dependencies

## Explanation

1. The first level holds the tasks without prerequisites: the source produces sound.
2. From there each level is built by marking the placed tasks and collecting every task whose prerequisites are all marked already, so the tasks inside one level never wait for one another and can run in parallel.
3. The task that must wait for several prerequisites is part is absorbed (after sound reaches the wall and part is reflected).
4. The resulting levels are the source produces sound | sound reaches the wall, part is reflected | part is absorbed, the microphone receives the echo, and reading them in order gives a valid total ordering, because a task is only ever placed after every prerequisite it names.

Reference solution as printed in the source (form 30, 4 steps):

1. At level 1, place the tasks without prerequisites: the source produces sound.
2. after each level, mark the completed tasks and check which prerequisites have now been satisfied.
3. The resulting levels are: the source produces sound | sound reaches the wall, part is reflected | part is absorbed, the microphone receives the echo.
4. A valid total order can be obtained by choosing any order within each level, without reversing any dependency: the source produces sound → sound reaches the wall → part is reflected → part is absorbed → the microphone receives the echo.

## Result

**Answer.** Plan by levels: the source produces sound | sound reaches the wall, part is reflected | part is absorbed, the microphone receives the echo.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
