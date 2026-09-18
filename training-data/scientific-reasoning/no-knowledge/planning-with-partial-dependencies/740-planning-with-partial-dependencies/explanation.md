# Explanation 740 — Planning with partial dependencies

## Explanation

1. The first level holds the tasks without prerequisites: temperature is measured.
2. From there each level is built by marking the placed tasks and collecting every task whose prerequisites are all marked already, so the tasks inside one level never wait for one another and can run in parallel.
3. The task that must wait for several prerequisites is energy is recorded (after natural light is observed and the devices have been selected).
4. The resulting levels are temperature is measured | natural light is observed, the devices have been selected | energy is recorded, comfort is compared, and reading them in order gives a valid total ordering, because a task is only ever placed after every prerequisite it names.

Reference solution as printed in the source (form 30, 4 steps):

1. At level 1, place the tasks without prerequisites: temperature is measured.
2. after each level, mark the completed tasks and check which prerequisites have now been satisfied.
3. The resulting levels are: temperature is measured | natural light is observed, the devices have been selected | energy is recorded, comfort is compared.
4. A valid total order can be obtained by choosing any order within each level, without reversing any dependency: temperature is measured → natural light is observed → the devices have been selected → energy is recorded → comfort is compared.

## Result

**Answer.** Plan by levels: temperature is measured | natural light is observed, the devices have been selected | energy is recorded, comfort is compared.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
