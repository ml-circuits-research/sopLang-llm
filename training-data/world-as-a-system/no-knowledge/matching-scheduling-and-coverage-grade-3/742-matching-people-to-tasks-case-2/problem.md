# 742 — Matching people to tasks: case 2

Knowledge context. Scheduling and assignment problems connect people, tasks, times, and constraints.

Given facts. Four students must each receive one different task. Allowed assignments: Ava: ['Map', 'Timeline']; Ben: ['Budget', 'Survey']; Cara: ['Survey']; Dion: ['Budget', 'Timeline']. Cross-domain check: a local committee has 12 members, requires at least 7 present for quorum, and 11 are present.

Rules. Each student gets exactly one allowed task, and each task is used exactly once. A complete assignment must satisfy both conditions. For the cross-domain check, quorum exists when present members ≥ the stated threshold.

Task. Find one complete valid assignment. If none exists, explain why. Cross-domain check: is quorum met?
