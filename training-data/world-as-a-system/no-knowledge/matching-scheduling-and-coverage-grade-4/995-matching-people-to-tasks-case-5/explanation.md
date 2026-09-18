# Explanation 995 — Matching people to tasks: case 5

## Explanation

1. No student has a single allowed task, so the search starts with the most restricted list.
2. Trying the remaining allowed tasks in printed order yields Ava→Map, Ben→Budget, Cara→Survey, Dion→Timeline.
3. Every student keeps an allowed task, every task is used exactly once, and any branch that would leave a student without a free task was undone before the next candidate.

Reference solution as printed in the source (family N24, 3 steps):

1. Start with the most restricted student if one exists.
2. Assign an allowed task, then remove that task from the remaining choices.
3. One complete assignment is {'Ava': 'Map', 'Ben': 'Budget', 'Cara': 'Survey', 'Dion': 'Timeline'}. Cross-domain check: 11−4=7 independent reports remain. Mixed-domain verification: 101+6=107.

## Result

**Answer.** Valid assignment: Ava→Map, Ben→Budget, Cara→Survey, Dion→Timeline. Cross-domain answer: 7 independent reports. Mixed-domain answer: 107 map sheets.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
