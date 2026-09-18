# 7.8.4 — Dependency Chain and Join

Scenario. In comparing primary and secondary historical sources, five work packages A–E must be completed. A takes 6 minutes. B (17 min) and C (11 min) can start only after A but may then run in parallel. D (10 min) needs both B and C finished. E (17 min) follows D. A final safety or review buffer of 10 minutes is mandatory, and the completion limit is 57 minutes. The description mentions the total number of source statements, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
