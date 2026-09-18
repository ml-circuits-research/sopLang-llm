# 10.7.4 — Dependency Chain and Join

Scenario. In planning a heritage-building restoration, five work packages A–E must be completed. A takes 12 minutes. B (6 min) and C (13 min) can start only after A but may then run in parallel. D (8 min) needs both B and C finished. E (5 min) follows D. A final safety or review buffer of 7 minutes is mandatory, and the completion limit is 53 minutes. The description mentions the total number of restoration tasks, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
