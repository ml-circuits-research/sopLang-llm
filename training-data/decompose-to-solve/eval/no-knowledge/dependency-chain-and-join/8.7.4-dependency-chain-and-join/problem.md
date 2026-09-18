# 8.7.4 — Dependency Chain and Join

Scenario. In assigning permissions in a small organization, five work packages A–E must be completed. A takes 7 minutes. B (17 min) and C (6 min) can start only after A but may then run in parallel. D (10 min) needs both B and C finished. E (5 min) follows D. A final safety or review buffer of 4 minutes is mandatory, and the completion limit is 47 minutes. The description mentions the total number of permissions, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
