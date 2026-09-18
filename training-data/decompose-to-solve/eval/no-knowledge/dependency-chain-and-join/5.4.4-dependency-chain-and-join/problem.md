# 5.4.4 — Dependency Chain and Join

Scenario. In planning communication across time zones, five work packages A–E must be completed. A takes 17 minutes. B (5 min) and C (8 min) can start only after A but may then run in parallel. D (14 min) needs both B and C finished. E (11 min) follows D. A final safety or review buffer of 8 minutes is mandatory, and the completion limit is 70 minutes. The description mentions the total number of time-zone events, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
