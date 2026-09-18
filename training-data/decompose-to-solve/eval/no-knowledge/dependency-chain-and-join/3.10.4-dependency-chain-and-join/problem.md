# 3.10.4 — Dependency Chain and Join

Scenario. In estimating material and recycling flows, five work packages A–E must be completed. A takes 7 minutes. B (14 min) and C (5 min) can start only after A but may then run in parallel. D (11 min) needs both B and C finished. E (15 min) follows D. A final safety or review buffer of 6 minutes is mandatory, and the completion limit is 47 minutes. The description mentions the total number of waste units, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
