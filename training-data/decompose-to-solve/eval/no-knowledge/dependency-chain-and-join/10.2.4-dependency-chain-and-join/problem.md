# 10.2.4 — Dependency Chain and Join

Scenario. In planning a museum expansion and collection move, five work packages A–E must be completed. A takes 9 minutes. B (16 min) and C (11 min) can start only after A but may then run in parallel. D (18 min) needs both B and C finished. E (8 min) follows D. A final safety or review buffer of 8 minutes is mandatory, and the completion limit is 56 minutes. The description mentions the total number of museum work packages, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
