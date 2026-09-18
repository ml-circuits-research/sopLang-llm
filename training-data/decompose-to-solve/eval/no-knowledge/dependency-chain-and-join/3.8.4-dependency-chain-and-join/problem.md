# 3.8.4 — Dependency Chain and Join

Scenario. In planning a print run, five work packages A–E must be completed. A takes 15 minutes. B (9 min) and C (5 min) can start only after A but may then run in parallel. D (13 min) needs both B and C finished. E (9 min) follows D. A final safety or review buffer of 3 minutes is mandatory, and the completion limit is 53 minutes. The description mentions the total number of printed copies, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
