# 8.4.4 — Dependency Chain and Join

Scenario. In resolving software dependency constraints, five work packages A–E must be completed. A takes 10 minutes. B (18 min) and C (14 min) can start only after A but may then run in parallel. D (8 min) needs both B and C finished. E (13 min) follows D. A final safety or review buffer of 4 minutes is mandatory, and the completion limit is 50 minutes. The description mentions the total number of packages, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
