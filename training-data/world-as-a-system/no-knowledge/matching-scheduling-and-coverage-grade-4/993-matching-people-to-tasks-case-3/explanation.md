# Explanation 993 — Matching people to tasks: case 3

## Explanation

1. Dion has a single allowed task, so that choice is taken first and removed from the remaining choices.
2. Trying the remaining allowed tasks in printed order yields Ava→Timeline, Ben→Survey, Cara→Map, Dion→Budget.
3. Every student keeps an allowed task, every task is used exactly once, and any branch that would leave a student without a free task was undone before the next candidate.

Reference solution as printed in the source (family N24, 3 steps):

1. Start with the most restricted student if one exists.
2. Assign an allowed task, then remove that task from the remaining choices.
3. One complete assignment is {'Ava': 'Timeline', 'Ben': 'Survey', 'Cara': 'Map', 'Dion': 'Budget'}. Cross-domain check: 8+2=10, so the team finishes at 10:00.

## Result

**Answer.** Valid assignment: Ava→Timeline, Ben→Survey, Cara→Map, Dion→Budget. Cross-domain answer: 10:00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
