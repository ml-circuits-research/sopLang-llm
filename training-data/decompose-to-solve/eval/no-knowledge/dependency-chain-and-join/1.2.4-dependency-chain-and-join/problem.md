# 1.2.4 — Dependency Chain and Join

Scenario. In a local public-transport journey, five work packages A–E must be completed. A takes 5 minutes. B (10 min) and C (5 min) can start only after A but may then run in parallel. D (10 min) needs both B and C finished. E (7 min) follows D. A final safety or review buffer of 8 minutes is mandatory, and the completion limit is 37 minutes. The description mentions the total number of journey legs, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
