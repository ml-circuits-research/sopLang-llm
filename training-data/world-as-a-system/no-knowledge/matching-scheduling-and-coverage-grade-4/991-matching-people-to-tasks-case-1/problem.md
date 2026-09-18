# 991 — Matching people to tasks: case 1

Knowledge context. Scheduling and assignment problems connect people, tasks, times, and constraints.

Given facts. Four students must each receive one different task. Allowed assignments: Ava: ['Map', 'Timeline']; Ben: ['Budget', 'Survey']; Cara: ['Map', 'Survey']; Dion: ['Budget', 'Timeline']. Cross-domain check: researchers collected 7 reports, but 4 are exact duplicate copies that add no new independent information. Mixed-domain verification: a regional archive has 101 map sheets and receives 2 additional sheets during the exercise.

Rules. Each student gets exactly one allowed task, and each task is used exactly once. A complete assignment must satisfy both conditions. For the cross-domain check, independent reports = total reports − duplicate copies. For this verification, the final number of sheets equals starting sheets plus received sheets.

Task. Find one complete valid assignment. If none exists, explain why. Cross-domain check: how many non-duplicate reports remain? Mixed-domain verification: how many sheets are available after the delivery?
