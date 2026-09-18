# 3.5.4 — Dependency Chain and Join

Scenario. In comparing a constrained household budget, five work packages A–E must be completed. A takes 5 minutes. B (17 min) and C (13 min) can start only after A but may then run in parallel. D (11 min) needs both B and C finished. E (14 min) follows D. A final safety or review buffer of 5 minutes is mandatory, and the completion limit is 46 minutes. The description mentions the total number of budget items, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
