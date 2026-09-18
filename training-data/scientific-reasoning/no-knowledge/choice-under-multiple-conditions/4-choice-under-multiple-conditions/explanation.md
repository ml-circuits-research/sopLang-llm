# Explanation 4 — Choice under multiple conditions

## Explanation

1. The question turns the conditions into one conjunction: has air and has water and the shoot receives light and the temperature is suitable must all be YES at the same time, so a single NO eliminates an option.
2. Option D states YES for all 4 mandatory conditions, so it is the only option left standing.
3. The other options each fail at least one mandatory condition (A fails “the shoot receives light”; B fails “has air”; C fails “has water”).
4. Counting YES values would be unsafe here, because a missing mandatory condition cannot be compensated by the properties that do not replace it.

Reference solution as printed in the source (form 4, 4 steps):

1. We turn the requirement into a logical rule: condition 1 AND condition 2 AND...; this is not a points contest.
2. We check option D: all mandatory conditions are YES.
3. For each of the other options we find at least one NO on a mandatory condition; that single NO is enough for elimination.
4. The “most YES values” method would be unsafe because a missing critical condition cannot be compensated for by properties that do not replace the requirement.

## Result

**Answer.** Option D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
