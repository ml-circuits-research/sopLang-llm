# 743 — Matching people to tasks: case 3

Knowledge context. Scheduling and assignment problems connect people, tasks, times, and constraints.

Given facts. Four students must each receive one different task. Allowed assignments: Ava: ['Map', 'Timeline']; Ben: ['Budget', 'Survey']; Cara: ['Map', 'Survey']; Dion: ['Budget']. Cross-domain check: researchers collected 9 reports, but 4 are exact duplicate copies that add no new independent information.

Rules. Each student gets exactly one allowed task, and each task is used exactly once. A complete assignment must satisfy both conditions. For the cross-domain check, independent reports = total reports − duplicate copies.

Task. Find one complete valid assignment. If none exists, explain why. Cross-domain check: how many non-duplicate reports remain?
