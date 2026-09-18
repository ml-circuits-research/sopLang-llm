# 745 — Matching people to tasks: case 5

Knowledge context. Scheduling and assignment problems connect people, tasks, times, and constraints.

Given facts. Four students must each receive one different task. Allowed assignments: Ava: ['Map', 'Timeline']; Ben: ['Budget', 'Survey']; Cara: ['Map', 'Survey']; Dion: ['Budget', 'Timeline']. Cross-domain check: a survey team starts work at 8:00 and works for 2 hour(s) without a break.

Rules. Each student gets exactly one allowed task, and each task is used exactly once. A complete assignment must satisfy both conditions. For the cross-domain check, finishing time = starting time + duration.

Task. Find one complete valid assignment. If none exists, explain why. Cross-domain check: at what time does the team finish?
