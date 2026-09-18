# 1.1.4 — Dependency Chain and Join

Scenario. In household faults and maintenance observations, five work packages A–E must be completed. A takes 7 minutes. B (11 min) and C (17 min) can start only after A but may then run in parallel. D (6 min) needs both B and C finished. E (12 min) follows D. A final safety or review buffer of 4 minutes is mandatory, and the completion limit is 43 minutes. The description mentions the total number of observations, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
