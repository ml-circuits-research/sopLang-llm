# 8.3.4 — Dependency Chain and Join

Scenario. In planning backup and recovery, five work packages A–E must be completed. A takes 14 minutes. B (8 min) and C (7 min) can start only after A but may then run in parallel. D (17 min) needs both B and C finished. E (16 min) follows D. A final safety or review buffer of 4 minutes is mandatory, and the completion limit is 53 minutes. The description mentions the total number of data sets, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
