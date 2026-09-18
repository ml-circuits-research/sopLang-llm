# 9.3.4 — Dependency Chain and Join

Scenario. In planning a small project, five work packages A–E must be completed. A takes 7 minutes. B (18 min) and C (11 min) can start only after A but may then run in parallel. D (15 min) needs both B and C finished. E (17 min) follows D. A final safety or review buffer of 7 minutes is mandatory, and the completion limit is 68 minutes. The description mentions the total number of project tasks, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
