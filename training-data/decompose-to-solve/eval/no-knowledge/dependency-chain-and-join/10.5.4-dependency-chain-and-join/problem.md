# 10.5.4 — Dependency Chain and Join

Scenario. In launching a small manufacturing line, five work packages A–E must be completed. A takes 14 minutes. B (12 min) and C (6 min) can start only after A but may then run in parallel. D (14 min) needs both B and C finished. E (15 min) follows D. A final safety or review buffer of 9 minutes is mandatory, and the completion limit is 61 minutes. The description mentions the total number of production batches, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
